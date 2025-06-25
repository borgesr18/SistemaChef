'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { useRelatorios, DadosRelatorio } from '@/lib/relatoriosService';
import { useProdutos } from '@/lib/produtosService';
import { useFichasTecnicas } from '@/lib/fichasTecnicasService';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Verificando acesso...
      </div>
    );
  }

  const { gerarRelatorioCompleto } = useRelatorios();
  const { produtos } = useProdutos();
  const { fichasTecnicas } = useFichasTecnicas();

  const [relatorio, setRelatorio] = useState<DadosRelatorio | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarRelatorio = async () => {
      setIsLoading(true);
      try {
        const dados = await gerarRelatorioCompleto();
        setRelatorio(dados);
      } catch (error) {
        console.error('Erro ao gerar relatório:', error);
      } finally {
        setIsLoading(false);
      }
    };
    carregarRelatorio();
  }, [gerarRelatorioCompleto]);

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Carregando dados do dashboard...</div>
        </div>
      </div>
    );
  }

  if (!relatorio) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Erro ao carregar dados do dashboard</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      {/* (restante do conteúdo do dashboard permanece o mesmo) */}
