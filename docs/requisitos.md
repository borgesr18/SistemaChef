# Requisitos do CustoChef

## 1. Cadastro de Produtos (Insumos)

### Campos Obrigatórios:
- Nome do produto
- Unidade de medida (g, ml, unidade, etc.)
- Preço por unidade de medida
- Fornecedor

### Campos Opcionais:
- Marca
- Imagem do produto

### Informações Nutricionais (por 100g ou 100ml):
- Calorias
- Carboidratos
- Proteínas
- Gorduras totais
- Gorduras saturadas
- Gorduras trans
- Fibras
- Sódio

## 2. Cadastro de Fichas Técnicas (Receitas)

### Campos Obrigatórios:
- Nome da receita
- Descrição e categoria
- Ingredientes (vinculados aos insumos cadastrados)
- Quantidade de cada ingrediente
- Rendimento total (porções)
- Modo de preparo
- Tempo de preparo

### Cálculos Automáticos:
- Custo total da receita
- Custo por porção
- Informações nutricionais totais
- Informações nutricionais por porção

### Funcionalidades:
- Impressão em layout padronizado (A4, com logo)
- Campo para observações ou dicas do chef

## 3. Funcionalidades Extras

### Dashboard:
- Resumo de receitas
- Custo médio
- Insumos mais usados

### Relatórios:
- Exportáveis em PDF e Excel
- Filtros por ingredientes, receitas e categorias

### Estoque de Insumos:
- Quantidade disponível de cada insumo

### Usuários:
- Cadastro de usuários com diferentes permissões
- Níveis: administrador, cozinheiro, nutricionista

## 4. Requisitos Técnicos

### Frontend:
- Interface responsiva e intuitiva
- Design moderno e profissional
- Compatibilidade com dispositivos móveis

### Tecnologias:
- Next.js 14.x (versão estável)
- React 18.x
- Tailwind CSS para estilização
- Hospedagem no Vercel

### Armazenamento de Dados:
- Utilizar localStorage para simplificar a implementação
- Estrutura de dados JSON bem definida
- Exportação/importação de dados

### Performance:
- Carregamento rápido das páginas
- Otimização de imagens
- Código limpo e bem organizado
