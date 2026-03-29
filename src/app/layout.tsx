import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NextLevel Academy — Entrena como un profesional",
  description: "Academia online de hockey hielo y línea de alto rendimiento. Tecnificaciones, campamentos, cursos y clases personales.",
  keywords: ["hockey hielo", "hockey línea", "academia hockey", "entrenamiento hockey", "tecnificación hockey"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${oswald.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#050505] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
