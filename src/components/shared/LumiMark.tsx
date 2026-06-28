interface LumiMarkProps {
  size?: number;
  className?: string;
}

/**
 * The Lumi mark: a glow orb (gold → teal, matching the app's accent palette)
 * with a play-triangle cut out, and a few short rays suggesting the source
 * of light the name refers to. Inline SVG (not a raster file) so it scales
 * cleanly and never needs to be re-exported when the palette shifts.
 */
const LumiMark = ({ size = 32, className }: LumiMarkProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="lumiGlow" x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#6366f1" />
        <stop offset="1" stopColor="#10b981" />
      </linearGradient>
    </defs>
    <g stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
      <line x1="9" y1="20" x2="3" y2="14" />
      <line x1="16" y1="11" x2="12" y2="3" />
      <line x1="27" y1="7" x2="26" y2="0" />
    </g>
    <circle cx="33" cy="33" r="27" fill="url(#lumiGlow)" />
    <polygon points="27,22 27,44 46,33" fill="#0b0e14" />
  </svg>
);

export default LumiMark;
