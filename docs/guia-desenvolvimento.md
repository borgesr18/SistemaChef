# Guia de Desenvolvimento e Manutenção

Este documento fornece informações técnicas sobre a estrutura do código, arquitetura e práticas de desenvolvimento do CustoChef.

## Arquitetura do Sistema

O sistema foi desenvolvido utilizando o padrão de arquitetura App Router do Next.js, que organiza o código em:

### Estrutura de Diretórios

```
sistema-gastronomico-novo/
├── docs/                    # Documentação do sistema
├── public/                  # Arquivos estáticos
├── src/
│   ├── app/                 # Rotas e páginas da aplicação
│   │   ├── configuracoes/   # Módulo de configurações
│   │   ├── fichas-tecnicas/ # Módulo de fichas técnicas
│   │   ├── produtos/        # Módulo de produtos
│   │   ├── estoque/         # Módulo de controle de estoque
│   │   ├── relatorios/      # Módulo de relatórios
│   │   ├── layout.tsx       # Layout principal da aplicação
│   │   └── page.tsx         # Página inicial (dashboard)
│   ├── components/          # Componentes reutilizáveis
│   │   ├── layout/          # Componentes de layout
│   │   └── ui/              # Componentes de interface
│   ├── lib/                 # Serviços e lógica de negócios
│   └── utils/               # Funções utilitárias
├── next.config.js           # Configuração do Next.js
├── package.json             # Dependências e scripts
├── tsconfig.json            # Configuração do TypeScript
└── vercel.json              # Configuração do Vercel
```

## Componentes Principais

### Componentes de Layout

- **MainLayout**: Layout principal que inclui Header, Sidebar e Footer
- **Header**: Barra superior com informações do usuário
- **Sidebar**: Menu lateral de navegação

### Componentes UI

- **Button**: Botão com diferentes variantes e estados
- **Card**: Container para exibição de conteúdo
- **Input**: Campo de entrada de texto
- **Select**: Campo de seleção de opções
- **Table**: Tabela para exibição de dados
- **Modal**: Janela modal para interações específicas
- **Textarea**: Campo de texto multilinha

## Serviços

### produtosService.ts

Gerencia o estado e operações relacionadas aos produtos:

- `useProdutos()`: Hook que fornece acesso aos produtos e funções para manipulá-los
- Funções: `adicionarProduto`, `atualizarProduto`, `removerProduto`, `obterProdutoPorId`
- Cada produto armazena também o campo `pesoEmbalagem`, usado para calcular o custo real por grama ou mililitro.
- Persistência em localStorage

### fichasTecnicasService.ts

Gerencia o estado e operações relacionadas às fichas técnicas:

- `useFichasTecnicas()`: Hook que fornece acesso às fichas técnicas e funções para manipulá-las
- Funções: `adicionarFichaTecnica`, `atualizarFichaTecnica`, `removerFichaTecnica`, `obterFichaTecnicaPorId`
- Cálculos automáticos de custos e informações nutricionais
- Persistência em localStorage

### relatoriosService.ts

Gera relatórios baseados nos dados de produtos e fichas técnicas:

- `useRelatorios()`: Hook que fornece funções para gerar diferentes tipos de relatórios
- Funções: `gerarRelatorioCompleto`, `gerarRelatorioCustos`, `gerarRelatorioIngredientes`, `gerarRelatorioReceitas`
- Cálculos de métricas e estatísticas

### usuariosService.ts

Gerencia autenticação e cadastro de usuários:

- `useUsuarios()`: Hook para acessar usuários e funções de login
- Funções: `registrarUsuario`, `login`, `logout`, `removerUsuario`, `alterarSenha`
- Persistência em localStorage

### estoqueService.ts

Gerencia o histórico de compras e a quantidade em estoque:

- `useEstoque()`: Hook para registrar entradas e saídas de produtos
- Funções: `registrarEntrada`, `registrarSaida`, `obterHistoricoPorProduto`, `calcularEstoqueAtual`
- Atualiza automaticamente o preço dos produtos e os custos das fichas técnicas
- Persistência em localStorage
- `/estoque-producao` lista o saldo de cada ficha técnica utilizando `calcularEstoqueAtual`

### producaoService.ts

Controla o histórico de produções realizadas:

- `useProducao()`: Hook para registrar novas produções
- Função: `registrarProducao`
- Cada registro armazena `custoTotal` com o valor calculado do lote
- O custo é calculado multiplicando `custoTotal` da ficha pelo fator da quantidade produzida
- Persistência em localStorage

### precosService.ts

 Gerencia estratégias de precificação baseadas em produções:

 - `usePrecosVenda()`: Hook para salvar, alterar e listar estratégias
 - Função `salvarEstrategia` calcula e armazena preços de venda a partir do custo unitário
 - Persistência em localStorage

## Padrões de Código

### Componentes React

- Todos os componentes que usam hooks do React devem incluir a diretiva `'use client'` no topo do arquivo
- Componentes funcionais com TypeScript (React.FC)
- Props tipadas com interfaces

### Estado da Aplicação

- Estado gerenciado através de hooks personalizados
- Persistência em localStorage
- Padrão de serviços para separar lógica de negócios da interface

### Estilização

- Tailwind CSS para estilização
- Classes utilitárias para responsividade
- Componentes UI reutilizáveis

## Diretrizes para Manutenção

### Adicionando Novos Recursos

1. **Novos Componentes UI**:
   - Adicione na pasta `src/components/ui`
   - Siga o padrão de tipagem e estilização existente
   - Inclua a diretiva `'use client'` se usar hooks

2. **Novas Páginas**:
   - Adicione na pasta `src/app` seguindo a estrutura de rotas do Next.js
   - Use o MainLayout para manter a consistência visual

3. **Novos Serviços**:
   - Adicione na pasta `src/lib`
   - Siga o padrão de hooks personalizados

### Modificando Recursos Existentes

1. **Alterando Componentes**:
   - Mantenha a compatibilidade com os componentes existentes
   - Atualize a documentação se houver mudanças na API

2. **Alterando Serviços**:
   - Verifique o impacto em outros serviços que possam depender dele
   - Mantenha a persistência em localStorage ou implemente outra solução

### Testes

Embora o sistema atual não inclua testes automatizados, é recomendável adicionar:

- Testes unitários para componentes e serviços
- Testes de integração para fluxos completos
- Testes end-to-end para validar a experiência do usuário

## Deploy e Infraestrutura

O sistema está configurado para deploy no Vercel:

- **next.config.js**: Configurações otimizadas para o Vercel
- **vercel.json**: Configurações específicas da plataforma

Para fazer deploy:
1. Siga as instruções no arquivo `docs/deploy-vercel.md`
2. Certifique-se de que todas as dependências estão atualizadas
3. Verifique se o build local funciona corretamente antes do deploy

## Evolução Futura

Áreas para desenvolvimento futuro:

1. **Autenticação e Autorização**:
   - Sistema de login implementado utilizando armazenamento local
   - Definir níveis de acesso para diferentes usuários

2. **Banco de Dados Remoto**:
   - Migrar do localStorage para um banco de dados remoto
   - Implementar sincronização entre dispositivos

3. **API Backend**:
   - Desenvolver uma API para separar frontend e backend
   - Implementar validações e regras de negócio no servidor

4. **Funcionalidades Adicionais**:
   - Controle de estoque
   - Planejamento de produção
   - Exportação de relatórios em diferentes formatos

---

Documentação técnica criada em: Abril de 2025
