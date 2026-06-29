export type EventType = "birthday" | "wedding" | "graduation" | "babyshower" | "other";

interface MotifProps {
  color: string;
  size?: number;
}

export function BirthdayMotif({ color, size = 160 }: MotifProps) {
  const s = size;
  const c = 16;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={c + 12} cy={c + 12} r={14} />
      <circle cx={c + 30} cy={c + 6} r={12} />
      <circle cx={c + 48} cy={c + 14} r={10} />
      <line x1={c + 12} y1={c + 26} x2={c + 10} y2={c + 44} />
      <line x1={c + 30} y1={c + 18} x2={c + 29} y2={c + 44} />
      <line x1={c + 48} y1={c + 24} x2={c + 46} y2={c + 44} />
      <path d={`M${c + 4} ${c + 44} Q${c + 18} ${c + 38} ${c + 24} ${c + 44} Q${c + 30} ${c + 50} ${c + 36} ${c + 44} Q${c + 42} ${c + 38} ${c + 56} ${c + 44}`} />

      <path d={`M${s - c - 20} ${s - c - 20} Q${s - c - 40} ${s - c - 50} ${s - c - 12} ${s - c - 44}`} strokeWidth={2} />
      <path d={`M${s - c - 28} ${s - c - 16} Q${s - c - 6} ${s - c - 46} ${s - c - 10} ${s - c - 24}`} strokeWidth={1.5} />
      <circle cx={s - c - 38} cy={s - c - 54} r={4} />
      <circle cx={s - c - 14} cy={s - c - 60} r={3} />
      <circle cx={s - c - 30} cy={s - c - 58} r={3.5} />
      <circle cx={s - c - 42} cy={s - c - 46} r={2.5} />
    </svg>
  );
}

export function WeddingMotif({ color, size = 160 }: MotifProps) {
  const s = size;
  const c = 20;
  const cx = s / 2;
  const cy = c + 20;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={cx - 18} cy={cy} r={16} />
      <circle cx={cx + 18} cy={cy} r={16} />
      <path d={`M${cx - 18} ${cy - 2} Q${cx - 6} ${cy - 16} ${cx} ${cy - 6}`} strokeWidth={3} />
      <path d={`M${cx + 18} ${cy - 2} Q${cx + 6} ${cy - 16} ${cx} ${cy - 6}`} strokeWidth={3} />
      <path d={`M${cx - 24} ${cy + 16} Q${cx - 16} ${cy + 32} ${cx - 12} ${cy + 48}`} />
      <path d={`M${cx - 12} ${cy + 32} Q${cx - 20} ${cy + 52} ${cx - 22} ${cy + 64}`} />
      <path d={`M${cx + 24} ${cy + 16} Q${cx + 16} ${cy + 30} ${cx + 14} ${cy + 48}`} />
      <path d={`M${cx + 8} ${cy + 28} Q${cx + 2} ${cy + 52} ${cx - 4} ${cy + 64}`} />
      <path d={`M${cx - 16} ${cy + 48} Q${cx - 8} ${cy + 44} ${cx - 4} ${cy + 50}`} strokeWidth={1.5} />
      <circle cx={cx - 8} cy={cy + 54} r={3} strokeWidth={1.5} />
      <circle cx={cx - 12} cy={cy + 58} r={2} strokeWidth={1.5} />
    </svg>
  );
}

export function GraduationMotif({ color, size = 160 }: MotifProps) {
  const s = size;
  const c = 20;
  const cx = s / 2;
  const top = c + 8;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${cx - 28} ${top + 20} L${cx} ${top} L${cx + 28} ${top + 20} Z`} />
      <line x1={cx - 28} y1={top + 20} x2={cx - 28} y2={top + 28} />
      <line x1={cx + 28} y1={top + 20} x2={cx + 28} y2={top + 28} />
      <line x1={cx - 30} y1={top + 28} x2={cx + 30} y2={top + 28} />
      <path d={`M${cx - 4} ${top + 20} Q${cx} ${top + 14} ${cx + 4} ${top + 20}`} />
      <line x1={cx} y1={top + 28} x2={cx} y2={top + 16} strokeWidth={2} />

      <rect x={cx - 24} y={top + 52} width={48} height={32} rx={3} />
      <line x1={cx - 18} y1={top + 60} x2={cx + 18} y2={top + 60} />
      <line x1={cx - 18} y1={top + 68} x2={cx + 18} y2={top + 68} />
      <rect x={cx - 6} y={top + 48} width={12} height={6} rx={2} />
    </svg>
  );
}

export function BabyshowerMotif({ color, size = 160 }: MotifProps) {
  const s = size;
  const c = 20;
  const cx = s / 2;
  const top = c + 10;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${cx - 40} ${top + 8} Q${cx} ${top - 12} ${cx + 40} ${top + 8}`} />
      <line x1={cx - 46} y1={top + 10} x2={cx + 46} y2={top + 10} strokeWidth={1.5} />
      <line x1={cx - 34} y1={top + 12} x2={cx - 34} y2={top + 36} />
      <circle cx={cx - 34} cy={top + 46} r={8} />
      <path d={`M${cx - 34} ${top + 54} Q${cx - 38} ${top + 64} ${cx - 36} ${top + 68}`} />
      <line x1={cx - 10} y1={top + 12} x2={cx - 10} y2={top + 40} />
      <circle cx={cx - 10} cy={top + 50} r={8} />
      <line x1={cx + 14} y1={top + 12} x2={cx + 14} y2={top + 36} />
      <circle cx={cx + 14} cy={top + 46} r={8} />
      <path d={`M${cx + 14} ${top + 54} Q${cx + 10} ${top + 64} ${cx + 12} ${top + 68}`} />
      <line x1={cx + 38} y1={top + 12} x2={cx + 38} y2={top + 34} />
      <circle cx={cx + 38} cy={top + 44} r={7} />
      <path d={`M${cx + 38} ${top + 51} Q${cx + 34} ${top + 60} ${cx + 36} ${top + 64}`} />

      <path d={`M${cx - 46} ${s - c - 20} L${cx - 46} ${s - c}`} strokeWidth={2} />
      <path d={`M${cx - 52} ${s - c - 12} L${cx - 46} ${s - c - 20} L${cx - 40} ${s - c - 12}`} strokeWidth={2} />
    </svg>
  );
}

export function OtherMotif({ color, size = 160 }: MotifProps) {
  const s = size;
  const c = 16;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={c + 10} cy={c + 10} r={5} />
      <circle cx={c + 30} cy={c + 18} r={4} />
      <circle cx={c + 50} cy={c + 8} r={3.5} />
      <circle cx={c + 20} cy={c + 32} r={3} />
      <circle cx={c + 46} cy={c + 30} r={4} />
      <circle cx={c + 38} cy={c + 44} r={3} />
      <circle cx={c + 12} cy={c + 50} r={4.5} />
      <circle cx={c + 54} cy={c + 50} r={3.5} />

      <rect x={c + 22} y={c + 12} width={8} height={8} rx={1} transform={`rotate(15 ${c + 26} ${c + 16})`} />
      <rect x={c + 52} y={c + 36} width={7} height={7} rx={1} transform={`rotate(-20 ${c + 55.5} ${c + 39.5})`} />
      <rect x={c + 8} y={c + 34} width={6} height={6} rx={1} transform={`rotate(30 ${c + 11} ${c + 37})`} />

      <path d={`M${s - c - 16} ${s - c - 16} L${s - c} ${s - c}`} />
      <circle cx={s - c - 36} cy={s - c - 24} r={4} />
      <circle cx={s - c - 52} cy={s - c - 36} r={3.5} />
      <circle cx={s - c - 24} cy={s - c - 44} r={3} />
      <circle cx={s - c - 46} cy={s - c - 18} r={4} />
      <circle cx={s - c - 58} cy={s - c - 50} r={3} />
      <circle cx={s - c - 14} cy={s - c - 30} r={3.5} />
    </svg>
  );
}

export function getIllustration(type: string): (props: MotifProps) => React.ReactElement {
  switch (type) {
    case "birthday":
      return BirthdayMotif;
    case "wedding":
      return WeddingMotif;
    case "graduation":
      return GraduationMotif;
    case "babyshower":
      return BabyshowerMotif;
    default:
      return OtherMotif;
  }
}
