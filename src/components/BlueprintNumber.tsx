type Props = {
  value: number;
  className?: string;
};

/**
 * Blueprint-style number: no surrounding frame, larger glyph,
 * uniform thin outline stroke, no fill, with a second parallel
 * inner line for a wireframe/blueprint feel.
 */
export function BlueprintNumber({ value, className }: Props) {
  const label = String(value).padStart(2, "0");
  const W = 56;
  const H = 72;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={`shrink-0 h-14 w-11 md:h-16 md:w-12 ${className ?? ""}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* Number — outer stroked glyph */}
      <text
        x="50%"
        y="54%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fontSize="32"
        fontWeight={500}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
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
          fontSize="32"
          fontWeight={500}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.6"
          opacity="0.5"
        >
          {label}
        </text>
      </g>
    </svg>
  );
}
