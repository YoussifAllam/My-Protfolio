"""Image optimization for uploaded project media.

Every image a visitor downloads costs load time, so nothing gets served as-is.
Whatever is uploaded (PNG, JPEG, HEIC-via-Pillow, whatever a screenshot tool
produces) is decoded once, resized to the smallest dimensions the UI actually
displays, and re-encoded to WebP — which at equivalent visual quality runs
25-35% smaller than JPEG and doesn't carry PNG's lossless overhead for
photographic content. The original upload is never persisted; only the
optimized variants are ever written to storage.
"""

import hashlib
import time
from io import BytesIO

from django.core.files.base import ContentFile
from PIL import Image, ImageOps

DEFAULT_QUALITY = 82
# method=6 is Pillow's slowest WebP compressor and also its most effective —
# fine to pay for here since this runs once per upload, not per request.
WEBP_METHOD = 6


def build_variant(source_file, *, max_size, quality=DEFAULT_QUALITY, format="WEBP"):
    """Return a `ContentFile` holding a resized, re-encoded copy of `source_file`.

    `max_size` is `(width, height)`; the image is shrunk to fit inside that box
    with aspect ratio preserved and is never upscaled — `Image.thumbnail()` is a
    no-op if the source is already smaller. EXIF orientation is applied before
    resizing so a camera-rotated screenshot doesn't end up sideways.

    `format` defaults to WebP (smallest at equivalent quality) but PNG is
    available for small graphics — logos, favicons — where crisp edges and
    lossless transparency matter more than a few extra KB, and where the
    consumer (e.g. a `<link rel="icon" type="image/png">` tag) expects PNG.
    """
    source_file.seek(0)
    img = Image.open(source_file)
    img = ImageOps.exif_transpose(img)

    # Both formats handle RGB and RGBA directly; anything else (P, LA, CMYK,
    # 1-bit) gets flattened to whichever of those two keeps or discards
    # transparency correctly.
    if img.mode not in ("RGB", "RGBA"):
        has_alpha = "transparency" in img.info or img.mode in ("P", "LA")
        img = img.convert("RGBA") if has_alpha else img.convert("RGB")

    img.thumbnail(max_size, Image.LANCZOS)

    buffer = BytesIO()
    if format == "PNG":
        img.save(buffer, format="PNG", optimize=True)
    else:
        img.save(buffer, format="WEBP", quality=quality, method=WEBP_METHOD)
    buffer.seek(0)
    return ContentFile(buffer.read())


def variant_name(original_name, suffix, ext="webp"):
    """`photo.png` + "thumb" -> `photo-3f9a1c2b-thumb.webp`.

    The short hash keeps two uploads that happen to share a filename from
    colliding in storage (Django would otherwise silently suffix with `_1`,
    `_2`, ... on every re-upload of "screenshot.png"). The extension reflects
    what actually gets written, regardless of what was uploaded.
    """
    stem = original_name.rsplit("/", 1)[-1].rsplit(".", 1)[0] or "image"
    digest = hashlib.sha1(f"{original_name}:{time.time()}".encode()).hexdigest()[:8]
    return f"{stem}-{digest}-{suffix}.{ext}"


def image_field_changed(model_cls, pk, field_name, new_file):
    """True if `field_name` differs from what's currently stored for `pk`.

    Used to skip re-encoding on every plain `save()` — without this, editing a
    project's `order` field would re-process its cover image on each save
    (wasted work, and it would defeat `variant_name`'s point since every save
    would mint a new filename and orphan the previous one in storage).
    """
    old_name = None
    if pk:
        old_instance = model_cls.objects.filter(pk=pk).only(field_name).first()
        old_file = getattr(old_instance, field_name, None) if old_instance else None
        old_name = old_file.name if old_file else None

    new_name = new_file.name if new_file else None
    return new_name != old_name
