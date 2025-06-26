// src/app/layout.tsx
import './globals.css';
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata = {
  title: 'CustoChef',
  description: 'Sistema de fichas técnicas e controle de produção',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}

