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
        viewBox="0 0 430 54"
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
        <text x="0" y="38" fontFamily="'Arial Black','Helvetica Neue',sans-serif" fontWeight="900" fontSize="40" fill="#ffffff" letterSpacing="1">NEXT</text>
        {/* LEVEL */}
        <text x="112" y="38" fontFamily="'Arial Black','Helvetica Neue',sans-serif" fontWeight="900" fontSize="40" fill="url(#gl-h)" letterSpacing="1">LEVEL</text>
        {/* Separador vertical */}
        <line x1="254" y1="12" x2="254" y2="42" stroke="#2a2a2a" strokeWidth="1.5" />
        {/* ACADEMY — misma baseline que NEXT LEVEL */}
        <text x="264" y="38" fontFamily="'Arial Black','Helvetica Neue',sans-serif" fontWeight="700" fontSize="13" fill="#666666" letterSpacing="3.5">ACADEMY</text>
        {/* Stick — cubre todo el ancho, curva pequeña al final igual que el original */}
        <path d="M0 48 L400 48 Q418 48 418 30" stroke="url(#gl-h)" strokeWidth="3" strokeLinecap="round" fill="none" />
      </svg>
    )
  }

  // Versión vertical — dos líneas (footer, hero, splash)
  if (variant === "vertical") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 230 126"
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
        {/* Stick — cubre todo el ancho, curva pequeña al final */}
        <path d="M2 100 L210 100 Q226 100 226 84" stroke="url(#gl-v)" strokeWidth="4" strokeLinecap="round" fill="none" />
        {/* ACADEMY — debajo del stick, alineado a la izquierda */}
        <text x="2" y="120" fontFamily="'Arial Black','Helvetica Neue',sans-serif" fontWeight="700" fontSize="12" fill="#666666" letterSpacing="5">ACADEMY</text>
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
