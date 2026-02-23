export function LogoIcon({ size = 80 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 160 100"
      fill="none"
      width={size}
      height={size * 0.625}
      aria-hidden="true"
    >
      {/* Left store (orange) */}
      <g>
        <rect x="10" y="35" width="55" height="50" rx="5" fill="#F97316" />
        <path
          d="M5 38 L37.5 12 L70 38"
          stroke="#F97316"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="#FED7AA"
        />
        <rect x="28" y="56" width="17" height="29" rx="3" fill="#FED7AA" />
        <rect x="15" y="44" width="14" height="12" rx="2" fill="#FFF7ED" />
        <path
          d="M8 35 Q16 29 24 35 Q32 29 40 35 Q48 29 56 35 Q64 29 72 35"
          stroke="#EA580C"
          strokeWidth="2.5"
          fill="none"
        />
      </g>
      {/* Right store (red/warm) */}
      <g>
        <rect x="72" y="35" width="55" height="50" rx="5" fill="#EF4444" />
        <path
          d="M67 38 L99.5 12 L132 38"
          stroke="#EF4444"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="#FECACA"
        />
        <rect x="90" y="56" width="17" height="29" rx="3" fill="#FECACA" />
        <rect x="77" y="44" width="14" height="12" rx="2" fill="#FFF1F2" />
        <path
          d="M70 35 Q78 29 86 35 Q94 29 102 35 Q110 29 118 35 Q126 29 134 35"
          stroke="#DC2626"
          strokeWidth="2.5"
          fill="none"
        />
      </g>
      {/* Ground */}
      <line
        x1="2"
        y1="85"
        x2="135"
        y2="85"
        stroke="#E7E5E4"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LogoText({ className = "" }: { className?: string }) {
  return (
    <span
      className={`font-bold tracking-tight text-primary-500 ${className}`}
      style={{ letterSpacing: "-0.02em" }}
    >
      Tonarino
    </span>
  );
}

export default function Logo({
  size = "md",
  layout = "horizontal",
}: {
  size?: "sm" | "md" | "lg";
  layout?: "horizontal" | "vertical";
}) {
  if (layout === "vertical") {
    const iconSize = { sm: 60, md: 100, lg: 140 }[size];
    const textClass = {
      sm: "text-lg",
      md: "text-3xl",
      lg: "text-4xl",
    }[size];
    return (
      <div className="flex flex-col items-center gap-1">
        <LogoIcon size={iconSize} />
        <LogoText className={textClass} />
      </div>
    );
  }

  const iconSize = { sm: 36, md: 50, lg: 70 }[size];
  const textClass = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  }[size];

  return (
    <div className="flex items-center gap-2">
      <LogoIcon size={iconSize} />
      <LogoText className={textClass} />
    </div>
  );
}
