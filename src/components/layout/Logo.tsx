interface LogoProps {
  variant?: "horizontal" | "vertical" | "icon"
  height?: number
  className?: string
}

export default function Logo({ variant = "horizontal", height = 40, className = "" }: LogoProps) {

  // Versión horizontal — una línea (navbar)
  if (variant === "horizontal") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 380 58"
        height={height}
        width="auto"
        className={className}
        aria-label="NextLevel Academy"
      >
        <defs>
          <linearGradient id="gl-h" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00C8FF" />
            <stop offset="100%" stopColor="#0080FF" />
          </linearGradient>
        </defs>
        {/* NEXT */}
        <text x="0" y="34" fontFamily="'Arial Black','Helvetica Neue',sans-serif" fontWeight="900" fontSize="38" fill="#ffffff" letterSpacing="1">NEXT</text>
        {/* LEVEL */}
        <text x="110" y="34" fontFamily="'Arial Black','Helvetica Neue',sans-serif" fontWeight="900" fontSize="38" fill="url(#gl-h)" letterSpacing="1">LEVEL</text>
        {/* Separador vertical */}
        <line x1="246" y1="8" x2="246" y2="40" stroke="#2a2a2a" strokeWidth="1.5" />
        {/* ACADEMY */}
        <text x="256" y="28" fontFamily="'Arial Black','Helvetica Neue',sans-serif" fontWeight="700" fontSize="11" fill="#666666" letterSpacing="3">ACADEMY</text>
        {/* Stick: línea casi recta, curva mínima al final — como hockey hielo */}
        <path d="M0 44 L274 44 L284 44 Q292 44 292 36" stroke="url(#gl-h)" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
    )
  }

  // Versión vertical — dos líneas (hero, splash)
  if (variant === "vertical") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 220 110"
        height={height}
        width="auto"
        className={className}
        aria-label="NextLevel Academy"
      >
        <defs>
          <linearGradient id="gl-v" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00C8FF" />
            <stop offset="100%" stopColor="#0080FF" />
          </linearGradient>
        </defs>
        {/* NEXT */}
        <text x="2" y="46" fontFamily="'Arial Black','Helvetica Neue',sans-serif" fontWeight="900" fontSize="48" fill="#ffffff" letterSpacing="2">NEXT</text>
        {/* LEVEL */}
        <text x="2" y="90" fontFamily="'Arial Black','Helvetica Neue',sans-serif" fontWeight="900" fontSize="48" fill="url(#gl-v)" letterSpacing="2">LEVEL</text>
        {/* Stick */}
        <path d="M2 100 L196 100 Q214 100 214 82" stroke="url(#gl-v)" strokeWidth="4" strokeLinecap="round" fill="none" />
      </svg>
    )
  }

  // Versión icono — solo el stick con NL
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 60"
      height={height}
      width={height}
      className={className}
      aria-label="NL"
    >
      <defs>
        <linearGradient id="gl-i" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00C8FF" />
          <stop offset="100%" stopColor="#0080FF" />
        </linearGradient>
      </defs>
      <text x="4" y="42" fontFamily="'Arial Black','Helvetica Neue',sans-serif" fontWeight="900" fontSize="38" fill="url(#gl-i)">NL</text>
      <path d="M4 50 L48 50 Q56 50 56 42" stroke="url(#gl-i)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    </svg>
  )
}
