import { useEffect, useState } from "react";

interface Node {
  id: string;
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  color: "blue" | "green" | "yellow" | "dim";
  size: "lg" | "md" | "sm";
}

const nodes: Node[] = [
  { id: "clients", label: "Web & Mobile", sublabel: "Clients", x: 50, y: 6, color: "dim", size: "sm" },
  { id: "nginx", label: "Nginx", sublabel: "Reverse Proxy", x: 50, y: 21, color: "dim", size: "md" },
  { id: "django", label: "Django REST API", sublabel: "Core Backend", x: 50, y: 40, color: "blue", size: "lg" },
  { id: "postgres", label: "PostgreSQL", x: 16, y: 60, color: "green", size: "md" },
  { id: "redis", label: "Redis", x: 50, y: 60, color: "yellow", size: "md" },
  { id: "celery", label: "Celery", x: 84, y: 60, color: "dim", size: "md" },
  { id: "monitor", label: "Monitoring", sublabel: "Grafana · Prometheus", x: 50, y: 79, color: "dim", size: "sm" },
];

const sideNodes = [
  { label: "WebSockets", x: 5, y: 38 },
  { label: "Elasticsearch", x: 5, y: 50 },
  { label: "Docker", x: 95, y: 38 },
  { label: "AWS EC2", x: 95, y: 50 },
];

const connections = [
  { from: "clients", to: "nginx" },
  { from: "nginx", to: "django" },
  { from: "django", to: "postgres" },
  { from: "django", to: "redis" },
  { from: "django", to: "celery" },
  { from: "redis", to: "monitor" },
];

const colorStyles = {
  blue: {
    bg: "bg-[#172033] border-[#3776AB]",
    text: "text-[#4B9CD3]",
    dot: "bg-[#3776AB]",
  },
  green: {
    bg: "bg-[#0C4B33]/30 border-[#44B78B]/40",
    text: "text-[#44B78B]",
    dot: "bg-[#44B78B]",
  },
  yellow: {
    bg: "bg-[#172033] border-[#FFD343]/30",
    text: "text-[#FFD343]",
    dot: "bg-[#FFD343]",
  },
  dim: {
    bg: "bg-[#111827] border-[#243044]",
    text: "text-[#94A3B8]",
    dot: "bg-[#64748B]",
  },
};

const sizeStyles = {
  lg: "min-w-[120px] px-3 py-2",
  md: "min-w-[90px] px-2.5 py-1.5",
  sm: "min-w-[80px] px-2 py-1",
};

interface Packet {
  id: number;
  fromNode: string;
  toNode: string;
  progress: number;
}

export default function ArchitectureDiagram() {
  const [packets, setPackets] = useState<Packet[]>([]);
  const [packetCounter, setPacketCounter] = useState(0);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    let counter = 0;
    const spawnPacket = () => {
      const conn = connections[Math.floor(Math.random() * connections.length)];
      counter += 1;
      const id = counter;
      setPacketCounter(counter);
      setPackets((prev) => [...prev, { id, fromNode: conn.from, toNode: conn.to, progress: 0 }]);
      setTimeout(() => {
        setPackets((prev) => prev.filter((p) => p.id !== id));
      }, 1800);
    };

    const interval = setInterval(spawnPacket, 700);
    return () => clearInterval(interval);
  }, []);

  const getNodeCenter = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return { x: 50, y: 50 };
    return { x: node.x, y: node.y + 3 };
  };

  return (
    <div
      className="relative w-full"
      style={{ height: "380px" }}
      aria-label="Django backend architecture diagram"
      role="img"
    >
      {/* SVG connections */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {connections.map((conn, i) => {
          const from = getNodeCenter(conn.from);
          const to = getNodeCenter(conn.to);
          return (
            <line
              key={i}
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              stroke="#243044"
              strokeWidth="0.4"
              strokeDasharray="1.5 1"
            />
          );
        })}

        {/* Data packets */}
        {packets.map((packet) => {
          const from = getNodeCenter(packet.fromNode);
          const to = getNodeCenter(packet.toNode);
          const elapsed = Date.now() % 1800;
          const t = Math.min(elapsed / 1800, 1);
          const x = from.x + (to.x - from.x) * t;
          const y = from.y + (to.y - from.y) * t;
          return (
            <circle
              key={packet.id}
              cx={`${x}%`}
              cy={`${y}%`}
              r="0.8"
              fill="#4B9CD3"
              opacity="0.8"
              style={{ animation: `packet-flow 1.8s linear` }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => {
        const styles = colorStyles[node.color];
        const sz = sizeStyles[node.size];
        return (
          <div
            key={node.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 border rounded-lg ${styles.bg} ${sz} flex flex-col items-center text-center`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <div className="flex items-center gap-1 mb-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} flex-shrink-0`} />
              <span className={`font-mono font-medium text-[11px] ${styles.text} leading-none`}>
                {node.label}
              </span>
            </div>
            {node.sublabel && (
              <span className="text-[9px] text-[#64748B] font-mono leading-none">{node.sublabel}</span>
            )}
          </div>
        );
      })}

      {/* Side nodes */}
      {sideNodes.map((node) => (
        <div
          key={node.label}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
        >
          <span className="font-mono text-[9px] text-[#64748B] border border-[#1a2538] rounded px-1.5 py-0.5 bg-[#080D18]/80 whitespace-nowrap">
            {node.label}
          </span>
        </div>
      ))}

      {/* Diagram label */}
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <span className="font-mono text-[9px] text-[#64748B]">
          // system architecture · illustrative
        </span>
      </div>
    </div>
  );
}
