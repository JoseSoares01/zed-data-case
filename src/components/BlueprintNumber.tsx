type Props = {
  value: number;
  className?: string;
};

/**
 * Blueprint-style number: uniform 2px outline stroke, no fill,
 * with a second parallel inner line and small diagonal tick
 * connectors at the corners for a wireframe/blueprint feel.
 */
export function BlueprintNumber({ value, className }: Props) {
  const label = String(value).padStart(2, "0");
  // viewBox chosen so 2-digit numbers sit centered with breathing room
  const W = 44;
  const H = 56;
  const R = 6;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`shrink-0 h-11 w-9 md:h-12 md:w-10 ${className ?? ""}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* Outer rounded frame */}
      <rect
        x="1"
        y="1"
        width={W - 2}
        height={H - 2}
        rx={R}
        ry={R}
        strokeWidth="2"
      />
      {/* Inner parallel frame */}
      <rect
        x="4.5"
        y="4.5"
        width={W - 9}
        height={H - 9}
        rx={R - 2.5}
        ry={R - 2.5}
        strokeWidth="1"
        opacity="0.55"
      />
      {/* Diagonal blueprint ligações at the 4 corners */}
      <line x1="1" y1="6" x2="6" y2="1" strokeWidth="1" opacity="0.55" />
      <line x1={W - 6} y1="1" x2={W - 1} y2="6" strokeWidth="1" opacity="0.55" />
      <line x1="1" y1={H - 6} x2="6" y2={H - 1} strokeWidth="1" opacity="0.55" />
      <line
        x1={W - 6}
        y1={H - 1}
        x2={W - 1}
        y2={H - 6}
        strokeWidth="1"
        opacity="0.55"
      />

      {/* Number — outer stroked glyph */}
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="22"
        fontWeight={500}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        {label}
      </text>
      {/* Number — inner parallel glyph (scaled slightly smaller) */}
      <g transform={`translate(${W / 2} ${H * 0.54}) scale(0.78) translate(${-W / 2} ${-H * 0.54})`}>
        <text
          x="50%"
          y="54%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="22"
          fontWeight={500}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.55"
        >
          {label}
        </text>
      </g>
    </svg>
  );
}
