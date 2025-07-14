/** biome-ignore-all lint/a11y/noSvgWithoutTitle: no title needed */
export default function Logo() {
  return (
    <div>
      <span className="sr-only">Logo</span>
      <svg
        fill="none"
        height="48"
        viewBox="0 0 48 48"
        width="48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="24"
          cy="24"
          fill="url(#zenithly-logo-gradient)"
          r="20"
          stroke="url(#zenithly-logo-gradient)"
          strokeWidth="2.5"
        />
        <path
          d="M16 26 L24 14 L32 26"
          fill="none"
          stroke="#fff"
          strokeLinecap="round"
          strokeWidth="2.5"
        />
        <circle cx="24" cy="29" fill="#fff" r="2" />
        <line
          stroke="#fff"
          strokeLinecap="round"
          strokeWidth="2"
          x1="18"
          x2="30"
          y1="34"
          y2="34"
        />
        <line
          stroke="#fff"
          strokeLinecap="round"
          strokeWidth="1.5"
          x1="20.5"
          x2="27.5"
          y1="38"
          y2="38"
        />
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="zenithly-logo-gradient"
            x1="10"
            x2="38"
            y1="10"
            y2="38"
          >
            <stop stopColor="var(--color-primary, #6366F1)" />
            <stop offset="0.7" stopColor="#A1A1AA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
