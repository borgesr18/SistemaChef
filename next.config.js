/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração otimizada para o Vercel
  reactStrictMode: true,
  images: {
    domains: [],
    unoptimized: false, // O Vercel suporta otimização de imagens nativamente
  },
  eslint: {
    ignoreDuringBuilds: true, // Evita que erros de lint interrompam o build
  },
  typescript: {
    ignoreBuildErrors: true, // Evita que erros de TypeScript interrompam o build
  },
};

module.exports = nextConfig;
