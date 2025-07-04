export default function Logo() {
  return (
    <div>
      <span className="sr-only">Logo</span>
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="url(#zenithly-logo-gradient)"
          stroke="url(#zenithly-logo-gradient)"
          strokeWidth="2.5"
        />
        <path
          d="M16 26 L24 14 L32 26"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="24" cy="29" r="2" fill="#fff" />
        <line
          x1="18"
          y1="34"
          x2="30"
          y2="34"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="20.5"
          y1="38"
          x2="27.5"
          y2="38"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient
            id="zenithly-logo-gradient"
            x1="10"
            x2="38"
            y1="10"
            y2="38"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="var(--color-primary, #6366F1)" />
            <stop offset="0.7" stopColor="#A1A1AA" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
