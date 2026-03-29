"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginForm() {
  const supabase = createClient();

  const loginConGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Fondo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#001a2e] via-[#050505] to-[#050505]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#00C8FF]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <span className="font-display text-3xl font-bold tracking-widest">
              NEXT<span className="text-gradient">LEVEL</span>
            </span>
            <div className="text-[#555] text-xs tracking-[0.3em] uppercase mt-1">Academy</div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">ACCEDE A TU CUENTA</h1>
            <p className="text-[#555] text-sm">Entrena. Evoluciona. Domina.</p>
          </div>

          {/* Botón Google */}
          <button
            onClick={loginConGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-lg hover:bg-gray-100 transition-colors text-sm tracking-wide"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.39a4.6 4.6 0 01-2 3.02v2.5h3.23c1.9-1.74 3-4.3 3-7.31z" fill="#4285F4" />
              <path d="M10 20c2.7 0 4.96-.9 6.62-2.43l-3.23-2.5c-.9.6-2.04.96-3.39.96-2.6 0-4.8-1.75-5.59-4.1H1.09v2.58A10 10 0 0010 20z" fill="#34A853" />
              <path d="M4.41 11.93A5.97 5.97 0 014.1 10c0-.67.12-1.32.31-1.93V5.49H1.09A10 10 0 000 10c0 1.61.39 3.14 1.09 4.51l3.32-2.58z" fill="#FBBC05" />
              <path d="M10 3.96c1.47 0 2.79.5 3.83 1.5l2.87-2.87C14.95 1.04 12.7 0 10 0A10 10 0 001.09 5.49l3.32 2.58C5.2 5.72 7.4 3.96 10 3.96z" fill="#EA4335" />
            </svg>
            Continuar con Google
          </button>

          <p className="text-center text-[#333] text-xs mt-6 leading-relaxed">
            Al acceder aceptas nuestros{" "}
            <Link href="#" className="text-[#555] hover:text-white transition-colors">
              Términos de uso
            </Link>{" "}
            y{" "}
            <Link href="#" className="text-[#555] hover:text-white transition-colors">
              Política de privacidad
            </Link>
          </p>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-[#444] text-xs hover:text-white transition-colors tracking-wider uppercase">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
