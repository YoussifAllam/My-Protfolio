/**
 * Single source of truth for profile links. Consumed by Footer and Contact.
 * Previously Footer held the real URLs while Contact rendered literal
 * placeholder text ("Add your LinkedIn URL") to visitors.
 */
export interface SocialLink {
  label: string;
  href: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/YoussifAllam" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/youssif-hassan-495697249/" },
  { label: "Medium", href: "https://medium.com/@youssifhassan011" },
  { label: "Codeforces", href: "https://codeforces.com/profile/youssif.hassan" },
  { label: "LeetCode", href: "https://leetcode.com/u/youssifhassan011/" },
  { label: "Kaggle", href: "https://www.kaggle.com/youssifhassan" },
];

export const CONTACT_EMAIL = "youssifhassan011@gmail.com";
export const LOCATION = "Cairo, Egypt";
