'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { unidadesRendimento, FichaTecnicaInfo, IngredienteFicha, calcularRendimentoTotal, adicionarFichaTecnica } from '@/lib/fichasTecnicasService';
import { useCategoriasReceita } from '@/lib/categoriasReceitasService';
import { useProdutos, ProdutoInfo } from '@/lib/produtosService';
import { useUnidadesMedida } from '@/lib/unidadesService';
import Table, { TableRow, TableCell } from '@/components/ui/Table';
import { useModal } from '@/components/ui/Modal';
import Modal from '@/components/ui/Modal';
import Toast from '@/components/ui/Toast';

type Ingrediente = Omit<IngredienteFicha, 'id' | 'custo'>;

interface FichaTecnicaForm {
  nome: string;
  descricao: string;
  categoria: string;
  ingredientes: Ingrediente[];
  modoPreparo: string;
  tempoPreparo: string;
  rendimentoTotal: string;
  unidadeRendimento: string;
  observacoes: string;
}

export default function NovaFichaTecnicaPage() {
  const router = useRouter();
  const { produtos } = useProdutos();
  const { unidades } = useUnidadesMedida();
  const { categorias } = useCategoriasReceita();
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState('');

  
  // Modal para adicionar ingredientes
  const { isOpen, openModal, closeModal } = useModal();
  
  // Estado para o ingrediente sendo adicionado
  const [ingredienteAtual, setIngredienteAtual] = useState<{
    produtoId: string;
    quantidade: string;
    unidade: string;
  }>({
    produtoId: '',
    quantidade: '',
    unidade: '',
  });
  
  // Estado para a ficha técnica
  const [fichaTecnica, setFichaTecnica] = useState<FichaTecnicaForm>({
    nome: '',
    descricao: '',
    categoria: '',
    ingredientes: [],
    modoPreparo: '',
    tempoPreparo: '',
    rendimentoTotal: '',
    unidadeRendimento: '',
    observacoes: '',
  });

  const calcularRendimentoTotalLocal = (ingredientes: Ingrediente[], unidadeRendimento: string, produtos: ProdutoInfo[]) => {
    if (!ingredientes.length || !unidadeRendimento || !produtos.length) return 0;
    
    const pesoTotal = ingredientes.reduce((total, ingrediente) => {
      const produto = produtos.find(p => p.id === ingrediente.produtoId);
      if (!produto) return total;
      
      const quantidade = Number(ingrediente.quantidade) || 0;
      let pesoIngrediente = 0;
      
      if (ingrediente.unidade === 'kg') {
        pesoIngrediente = quantidade * 1000;
      } else if (ingrediente.unidade === 'g') {
        pesoIngrediente = quantidade;
      } else if (ingrediente.unidade === 'l') {
        pesoIngrediente = quantidade * 1000;
      } else if (ingrediente.unidade === 'ml') {
        pesoIngrediente = quantidade;
      } else if (ingrediente.unidade === 'unidade') {
        pesoIngrediente = quantidade * (produto.pesoEmbalagem || 0);
      }
      
      return total + pesoIngrediente;
    }, 0);
    
    if (unidadeRendimento === 'porcoes') {
      return Math.floor(pesoTotal / 150);
    } else if (unidadeRendimento === 'kg') {
      return pesoTotal / 1000;
    } else if (unidadeRendimento === 'g') {
      return pesoTotal;
    } else if (unidadeRendimento === 'l') {
      return pesoTotal / 1000;
    } else if (unidadeRendimento === 'ml') {
      return pesoTotal;
    } else if (unidadeRendimento === 'unidades') {
      return Math.floor(pesoTotal / 100);
    }
    
    return 0;
  };

  useEffect(() => {
    if (!fichaTecnica.unidadeRendimento || produtos.length === 0) return;
    
    const total = calcularRendimentoTotalLocal(
      fichaTecnica.ingredientes,
      fichaTecnica.unidadeRendimento,
      produtos
    );
    setFichaTecnica(prev => ({
      ...prev,
      rendimentoTotal: total ? total.toString() : '0'
    }));
  }, [fichaTecnica.ingredientes, fichaTecnica.unidadeRendimento, produtos]);

  const [erros, setErros] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  // Manipular mudanças nos campos da ficha técnica
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFichaTecnica(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manipular mudanças nos campos do ingrediente atual
  const handleIngredienteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setIngredienteAtual(prev => {
      const atualizado = { ...prev, [name]: value };
      if (name === 'produtoId') {
        const prod = produtos.find(p => p.id === value);
        if (prod) atualizado.unidade = prod.unidadeMedida;
      }
      return atualizado;
    });
  };

  // Adicionar ingrediente à lista
  const adicionarIngrediente = () => {
    // Validar campos do ingrediente
    const errosIngrediente: Record<string, string> = {};
    
    if (!ingredienteAtual.produtoId) {
      errosIngrediente.produtoId = 'Selecione um produto';
    }
    
    if (!ingredienteAtual.quantidade) {
      errosIngrediente.quantidade = 'Quantidade é obrigatória';
    } else if (isNaN(Number(ingredienteAtual.quantidade)) || Number(ingredienteAtual.quantidade) <= 0) {
      errosIngrediente.quantidade = 'Quantidade deve ser um número positivo';
    }

    if (!ingredienteAtual.unidade) {
      errosIngrediente.unidade = 'Selecione a unidade';
    }
    
    if (Object.keys(errosIngrediente).length > 0) {
      setErros(prev => ({ ...prev, ...errosIngrediente }));
      return;
    }
    
    // Adicionar ingrediente à lista
    const novoIngrediente = {
      produtoId: ingredienteAtual.produtoId,
      quantidade: Number(ingredienteAtual.quantidade),
      unidade: ingredienteAtual.unidade,
    };
    
    setFichaTecnica(prev => ({
      ...prev,
      ingredientes: [...prev.ingredientes, novoIngrediente]
    }));
    
    // Limpar campos do ingrediente atual
    setIngredienteAtual({
      produtoId: '',
      quantidade: '',
      unidade: '',
    });
    
    // Limpar erros
    setErros(prev => {
      const novosErros = { ...prev };
      delete novosErros.produtoId;
      delete novosErros.quantidade;
      delete novosErros.unidade;
      return novosErros;
    });
    
    // Fechar modal
    closeModal();
  };

  // Remover ingrediente da lista
  const removerIngrediente = (index: number) => {
    setFichaTecnica(prev => ({
      ...prev,
      ingredientes: prev.ingredientes.filter((_, i) => i !== index)
    }));
  };

  // Validar formulário completo
  const validarFormulario = () => {
    const novosErros: Record<string, string> = {};
    
    if (!fichaTecnica.nome) novosErros.nome = 'Nome é obrigatório';
    if (!fichaTecnica.categoria) novosErros.categoria = 'Categoria é obrigatória';
    if (!fichaTecnica.modoPreparo) novosErros.modoPreparo = 'Modo de preparo é obrigatório';
    
    if (!fichaTecnica.tempoPreparo) {
      novosErros.tempoPreparo = 'Tempo de preparo é obrigatório';
    } else if (isNaN(Number(fichaTecnica.tempoPreparo)) || Number(fichaTecnica.tempoPreparo) <= 0) {
      novosErros.tempoPreparo = 'Tempo de preparo deve ser um número positivo';
    }
    
    
    if (!fichaTecnica.unidadeRendimento) novosErros.unidadeRendimento = 'Unidade de rendimento é obrigatória';
    
    if (fichaTecnica.ingredientes.length === 0) {
      novosErros.ingredientes = 'Adicione pelo menos um ingrediente';
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    setIsLoading(true);
    
    try {
      const fichaTecnicaFormatada = {
        ...fichaTecnica,
        tempoPreparo: String(fichaTecnica.tempoPreparo),
        rendimentoTotal: Number(fichaTecnica.rendimentoTotal),
      } as unknown as Omit<FichaTecnicaInfo, 'id' | 'custoTotal' | 'custoPorcao' | 'infoNutricional' | 'infoNutricionalPorcao' | 'dataCriacao' | 'dataModificacao'>;
      
      const result = await adicionarFichaTecnica(fichaTecnicaFormatada);
      if (result) {
        setToast('Ficha técnica criada com sucesso!');
        setTimeout(() => {
          router.push('/fichas-tecnicas');
        }, 1500);
      } else {
        setToast('Erro ao salvar ficha técnica');
      }
    } catch (error) {
      console.error('Erro ao salvar ficha técnica:', error);
      setToast('Erro ao salvar ficha técnica');
    } finally {
      setIsLoading(false);
    }
  };

  // Obter nome do produto pelo ID
  const getNomeProduto = (produtoId: string) => {
    const produto = produtos.find(p => p.id === produtoId);
    return produto ? produto.nome : 'Produto não encontrado';
  };

  // Formatar quantidade com unidade de medida
  const formatarQuantidade = (unidade: string, quantidade: number) => {
    const label = unidades.find(u => u.id === unidade)?.id || unidade;
    return `${quantidade} ${label}`;
  };

  return (
    <div className="space-y-6">
      <Toast message={toast} onClose={() => setToast('')} />
      <h1 className="text-2xl font-bold text-gray-800">Nova Ficha Técnica</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card title="Informações Básicas">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  name="nome"
                  value={fichaTecnica.nome}
                  onChange={handleChange}
                  error={erros.nome}
                  placeholder="Nome da Receita *"
                />
                
                <Select
                  label="Categoria *"
                  name="categoria"
                  value={fichaTecnica.categoria}
                  onChange={handleChange}
                  options={categorias
                    .map(c => ({ value: c.id, label: c.nome }))
                    .sort((a, b) => a.label.localeCompare(b.label))}
                  error={erros.categoria}
                />
              </div>
              
              <Textarea
                label="Descrição"
                name="descricao"
                value={fichaTecnica.descricao}
                onChange={handleChange}
                placeholder="Breve descrição da receita"
                rows={2}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input
                  name="tempoPreparo"
                  type="number"
                  min="1"
                  value={fichaTecnica.tempoPreparo}
                  onChange={handleChange}
                  error={erros.tempoPreparo}
                  placeholder="Tempo de Preparo (minutos) *"
                />
                
                <Input
                  name="rendimentoTotal"
                  type="number"
                  readOnly
                  value={fichaTecnica.rendimentoTotal}
                  placeholder="Rendimento Total"
                />
                
                <Select
                  label="Unidade de Rendimento *"
                  name="unidadeRendimento"
                  value={fichaTecnica.unidadeRendimento}
                  onChange={handleChange}
                  options={unidadesRendimento}
                  error={erros.unidadeRendimento}
                />
              </div>
            </div>
          </Card>
          
          <Card title="Ingredientes">
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={openModal}
                >
                  <span className="material-icons mr-1 text-sm">add</span>
                  Adicionar Ingrediente
                </Button>
              </div>
              
              {erros.ingredientes && (
                <p className="text-sm text-red-500 mt-1">{erros.ingredientes}</p>
              )}
              
              <Table
                headers={['Produto', 'Quantidade', 'Ações']}
                emptyMessage="Nenhum ingrediente adicionado. Clique em 'Adicionar Ingrediente'."
              >
                {fichaTecnica.ingredientes.map((ingrediente, index) => (
                  <TableRow key={index}>
                    <TableCell>{getNomeProduto(ingrediente.produtoId)}</TableCell>
                    <TableCell>{formatarQuantidade(ingrediente.unidade, ingrediente.quantidade)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removerIngrediente(index)}
                      >
                        <span className="material-icons text-sm text-red-500">delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            </div>
          </Card>
          
          <Card title="Modo de Preparo">
            <Textarea
              label="Instruções de Preparo *"
              name="modoPreparo"
              value={fichaTecnica.modoPreparo}
              onChange={handleChange}
              error={erros.modoPreparo}
              placeholder="Descreva passo a passo como preparar a receita"
              rows={6}
            />
          </Card>
          
          <Card title="Observações">
            <Textarea
              label="Observações ou Dicas do Chef"
              name="observacoes"
              value={fichaTecnica.observacoes}
              onChange={handleChange}
              placeholder="Dicas, variações ou informações adicionais sobre a receita"
              rows={4}
            />
          </Card>
          
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/fichas-tecnicas')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              isLoading={isLoading}
            >
              Salvar Ficha Técnica
            </Button>
          </div>
        </div>
      </form>
      
      {/* Modal para adicionar ingrediente */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Adicionar Ingrediente"
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Cancelar
            </Button>
            <Button variant="default" onClick={adicionarIngrediente}>
              Adicionar
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Produto *"
            name="produtoId"
            value={ingredienteAtual.produtoId}
            onChange={handleIngredienteChange}
            error={erros.produtoId}
            options={produtos
              .map(p => ({ value: p.id, label: `${p.nome} (${p.unidadeMedida})` }))
              .sort((a, b) => a.label.localeCompare(b.label))}
          />

          <Input
            name="quantidade"
            type="number"
            min="0.1"
            step="0.1"
            value={ingredienteAtual.quantidade}
            onChange={handleIngredienteChange}
            error={erros.quantidade}
            placeholder="Quantidade *"
          />

          <Select
            label="Unidade *"
            name="unidade"
            value={ingredienteAtual.unidade}
            onChange={handleIngredienteChange}
            error={erros.unidade}
            options={unidades
              .map(u => ({ value: u.id, label: u.nome }))
              .sort((a, b) => a.label.localeCompare(b.label))}
          />
        </div>
      </Modal>
    </div>
  );
}
