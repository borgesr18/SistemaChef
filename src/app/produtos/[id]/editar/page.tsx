'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useProdutos } from '@/lib/produtosService';
import { useUnidadesMedida } from '@/lib/unidadesService';
import { useCategorias } from '@/lib/categoriasService';
import Toast from '@/components/ui/Toast';

export default function EditarInsumoPage() {
  const params = useParams();
  const router = useRouter();
  const { obterProdutoPorId, atualizarProduto, isLoading: produtosLoading } = useProdutos();
  const { categorias } = useCategorias();
  const { unidades } = useUnidadesMedida();
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarInfoNutricional, setMostrarInfoNutricional] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(t);
  }, [toast]);
  
  const produtoId = params.id as string;
  
  const [produto, setProduto] = useState({
    nome: '',
    categoria: '',
    marca: '',
    unidadeMedida: '',
    preco: '',
    fornecedor: '',
    pesoEmbalagem: '',
    infoNutricional: {
      calorias: '',
      carboidratos: '',
      proteinas: '',
      gordurasTotais: '',
      gordurasSaturadas: '',
      gordurasTrans: '',
      fibras: '',
      sodio: ''
    }
  });

  const [erros, setErros] = useState<Record<string, string>>({});

  // Carregar dados do produto
  useEffect(() => {
    if (produtosLoading) return;
    const original = obterProdutoPorId(produtoId);
    if (!original) {
      router.push('/produtos');
      return;
    }
    setProduto({
      nome: original.nome,
      categoria: original.categoria || '',
      marca: original.marca || '',
      unidadeMedida: original.unidadeMedida,
      preco: original.preco?.toString() || '',
      fornecedor: original.fornecedor,
      pesoEmbalagem: original.pesoEmbalagem?.toString() || '',
      infoNutricional: {
        calorias: original.infoNutricional?.calorias?.toString() || '',
        carboidratos: original.infoNutricional?.carboidratos?.toString() || '',
        proteinas: original.infoNutricional?.proteinas?.toString() || '',
        gordurasTotais: original.infoNutricional?.gordurasTotais?.toString() || '',
        gordurasSaturadas: original.infoNutricional?.gordurasSaturadas?.toString() || '',
        gordurasTrans: original.infoNutricional?.gordurasTrans?.toString() || '',
        fibras: original.infoNutricional?.fibras?.toString() || '',
        sodio: original.infoNutricional?.sodio?.toString() || ''
      }
    });
    setMostrarInfoNutricional(!!original.infoNutricional);
  }, [produtosLoading, produtoId]);

  if (produtosLoading) {
    return <p>Carregando...</p>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProduto(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as Record<string, any>,
          [child]: value
        }
      }));
    } else {
      setProduto(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validarFormulario = () => {
    const novosErros: Record<string, string> = {};
    
    if (!produto.nome) novosErros.nome = 'Nome é obrigatório';
    if (!produto.categoria) novosErros.categoria = 'Categoria é obrigatória';
    if (!produto.unidadeMedida) novosErros.unidadeMedida = 'Unidade de medida é obrigatória';
    if (!produto.preco) novosErros.preco = 'Preço é obrigatório';
    else if (isNaN(Number(produto.preco)) || Number(produto.preco) <= 0)
      novosErros.preco = 'Preço deve ser um número positivo';
    if (!produto.fornecedor) novosErros.fornecedor = 'Fornecedor é obrigatório';
    if (!produto.pesoEmbalagem || isNaN(Number(produto.pesoEmbalagem)) || Number(produto.pesoEmbalagem) <= 0)
      novosErros.pesoEmbalagem = 'Informe o peso por embalagem';
    
    if (mostrarInfoNutricional) {
      const infoNutricional = produto.infoNutricional;
      
      if (infoNutricional.calorias && isNaN(Number(infoNutricional.calorias)))
        novosErros['infoNutricional.calorias'] = 'Deve ser um número';
      
      if (infoNutricional.carboidratos && isNaN(Number(infoNutricional.carboidratos)))
        novosErros['infoNutricional.carboidratos'] = 'Deve ser um número';
      
      if (infoNutricional.proteinas && isNaN(Number(infoNutricional.proteinas)))
        novosErros['infoNutricional.proteinas'] = 'Deve ser um número';
      
      if (infoNutricional.gordurasTotais && isNaN(Number(infoNutricional.gordurasTotais)))
        novosErros['infoNutricional.gordurasTotais'] = 'Deve ser um número';
      
      if (infoNutricional.gordurasSaturadas && isNaN(Number(infoNutricional.gordurasSaturadas)))
        novosErros['infoNutricional.gordurasSaturadas'] = 'Deve ser um número';
      
      if (infoNutricional.gordurasTrans && isNaN(Number(infoNutricional.gordurasTrans)))
        novosErros['infoNutricional.gordurasTrans'] = 'Deve ser um número';
      
      if (infoNutricional.fibras && isNaN(Number(infoNutricional.fibras)))
        novosErros['infoNutricional.fibras'] = 'Deve ser um número';
      
      if (infoNutricional.sodio && isNaN(Number(infoNutricional.sodio)))
        novosErros['infoNutricional.sodio'] = 'Deve ser um número';
    }
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;
    
    setIsLoading(true);
    
    try {
      // Converter valores numéricos
      const produtoFormatado = {
        ...produto,
        preco: Number(produto.preco),
        pesoEmbalagem: Number(produto.pesoEmbalagem),
        infoNutricional: mostrarInfoNutricional ? {
          calorias: Number(produto.infoNutricional.calorias) || 0,
          carboidratos: Number(produto.infoNutricional.carboidratos) || 0,
          proteinas: Number(produto.infoNutricional.proteinas) || 0,
          gordurasTotais: Number(produto.infoNutricional.gordurasTotais) || 0,
          gordurasSaturadas: Number(produto.infoNutricional.gordurasSaturadas) || 0,
          gordurasTrans: Number(produto.infoNutricional.gordurasTrans) || 0,
          fibras: Number(produto.infoNutricional.fibras) || 0,
          sodio: Number(produto.infoNutricional.sodio) || 0
        } : undefined
      };
      
      atualizarProduto(produtoId, produtoFormatado);
      router.push(`/produtos/${produtoId}`);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      setToast('Erro ao atualizar produto');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toast message={toast} onClose={() => setToast('')} />
      <h1 className="text-2xl font-bold text-gray-800">Editar Insumo</h1>
      
      <form onSubmit={handleSubmit}>
        <Card>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input
                label="Nome do Insumo *"
                name="nome"
                value={produto.nome}
                onChange={handleChange}
                error={erros.nome}
                placeholder="Ex: Farinha de Trigo"
              />

              <Select
                label="Categoria *"
                name="categoria"
                value={produto.categoria}
                onChange={handleChange}
                options={categorias
                  .map(c => ({ value: c.id, label: c.nome }))
                  .sort((a, b) => a.label.localeCompare(b.label))}
                error={erros.categoria}
              />

              <Input
                label="Marca"
                name="marca"
                value={produto.marca}
                onChange={handleChange}
                placeholder="Ex: Dona Benta"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Select
                label="Unidade de Medida *"
                name="unidadeMedida"
                value={produto.unidadeMedida}
                onChange={handleChange}
                options={unidades
                  .map(u => ({ value: u.id, label: u.nome }))
                  .sort((a, b) => a.label.localeCompare(b.label))}
                error={erros.unidadeMedida}
              />
              
              <Input
                label="Preço (R$) *"
                name="preco"
                type="number"
                step="0.01"
                min="0"
                value={produto.preco}
                onChange={handleChange}
                error={erros.preco}
                placeholder="Ex: 5.99"
              />
              
              <Input
                label="Fornecedor *"
                name="fornecedor"
                value={produto.fornecedor}
                onChange={handleChange}
                error={erros.fornecedor}
                placeholder="Ex: Distribuidora Alimentos"
              />

              <Input
                label="Peso/Volume por Embalagem (g ou ml) *"
                name="pesoEmbalagem"
                type="number"
                min="0"
                value={produto.pesoEmbalagem}
                onChange={handleChange}
                error={erros.pesoEmbalagem}
                placeholder="Ex: 1000"
              />
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="mostrarInfoNutricional"
                  checked={mostrarInfoNutricional}
                  onChange={() => setMostrarInfoNutricional(!mostrarInfoNutricional)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="mostrarInfoNutricional" className="ml-2 text-sm font-medium text-gray-700">
                  Adicionar informações nutricionais (por 100g/100ml)
                </label>
              </div>
              
              {mostrarInfoNutricional && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    label="Calorias (kcal)"
                    name="infoNutricional.calorias"
                    type="number"
                    min="0"
                    value={produto.infoNutricional.calorias}
                    onChange={handleChange}
                    error={erros['infoNutricional.calorias']}
                  />
                  
                  <Input
                    label="Carboidratos (g)"
                    name="infoNutricional.carboidratos"
                    type="number"
                    min="0"
                    step="0.1"
                    value={produto.infoNutricional.carboidratos}
                    onChange={handleChange}
                    error={erros['infoNutricional.carboidratos']}
                  />
                  
                  <Input
                    label="Proteínas (g)"
                    name="infoNutricional.proteinas"
                    type="number"
                    min="0"
                    step="0.1"
                    value={produto.infoNutricional.proteinas}
                    onChange={handleChange}
                    error={erros['infoNutricional.proteinas']}
                  />
                  
                  <Input
                    label="Gorduras Totais (g)"
                    name="infoNutricional.gordurasTotais"
                    type="number"
                    min="0"
                    step="0.1"
                    value={produto.infoNutricional.gordurasTotais}
                    onChange={handleChange}
                    error={erros['infoNutricional.gordurasTotais']}
                  />
                  
                  <Input
                    label="Gorduras Saturadas (g)"
                    name="infoNutricional.gordurasSaturadas"
                    type="number"
                    min="0"
                    step="0.1"
                    value={produto.infoNutricional.gordurasSaturadas}
                    onChange={handleChange}
                    error={erros['infoNutricional.gordurasSaturadas']}
                  />
                  
                  <Input
                    label="Gorduras Trans (g)"
                    name="infoNutricional.gordurasTrans"
                    type="number"
                    min="0"
                    step="0.1"
                    value={produto.infoNutricional.gordurasTrans}
                    onChange={handleChange}
                    error={erros['infoNutricional.gordurasTrans']}
                  />
                  
                  <Input
                    label="Fibras (g)"
                    name="infoNutricional.fibras"
                    type="number"
                    min="0"
                    step="0.1"
                    value={produto.infoNutricional.fibras}
                    onChange={handleChange}
                    error={erros['infoNutricional.fibras']}
                  />
                  
                  <Input
                    label="Sódio (mg)"
                    name="infoNutricional.sodio"
                    type="number"
                    min="0"
                    step="0.1"
                    value={produto.infoNutricional.sodio}
                    onChange={handleChange}
                    error={erros['infoNutricional.sodio']}
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/produtos/${produtoId}`)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              isLoading={isLoading}
            >
              Atualizar Insumo
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
