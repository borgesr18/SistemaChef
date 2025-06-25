// /src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MainLayout from "@/components/layout/MainLayout";
import { AuthProvider } from "@/contexts/AuthContext"; // 👈 Importação correta do novo contexto

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GastroChef",
  description: "Sistema de fichas técnicas e controle de produção",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider> {/* ✅ Envolvendo toda a aplicação com o contexto */}
          <MainLayout>{children}</MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
