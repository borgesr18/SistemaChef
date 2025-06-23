# Guia de Deploy no Vercel

Este documento fornece instruções detalhadas para realizar o deploy do CustoChef no Vercel.

## Por que o Vercel?

Após tentativas com Netlify e Cloudflare Pages que resultaram em diversos problemas de compatibilidade, o Vercel foi escolhido como plataforma de deploy ideal pelos seguintes motivos:

1. **Integração nativa com Next.js**: O Vercel foi criado pelos mesmos desenvolvedores do Next.js, garantindo compatibilidade perfeita
2. **Configuração simplificada**: Detecção automática das configurações do projeto
3. **Performance otimizada**: CDN global com edge functions para melhor desempenho
4. **Atualizações automáticas**: Deploy automático a cada push no repositório
5. **Previews de pull requests**: Ambiente de teste para cada PR

## Passo a Passo para Deploy

### 1. Preparação do Repositório

Certifique-se de que seu repositório contém os seguintes arquivos de configuração:

- `next.config.js`: Configurações otimizadas para o Vercel
- `vercel.json`: Configurações específicas da plataforma
- `package.json`: Com dependências corretas (React 18.2.0, Next.js 14.1.0)

### 2. Criação da Conta no Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Sign Up"
3. Recomendamos fazer login com sua conta GitHub para facilitar a integração

### 3. Importação do Projeto

1. No dashboard do Vercel, clique em "Add New..." > "Project"
2. Conecte sua conta GitHub se ainda não estiver conectada
3. Selecione o repositório do CustoChef
4. O Vercel detectará automaticamente que é um projeto Next.js

### 4. Configuração do Deploy

Mantenha as configurações padrão detectadas pelo Vercel:

- **Framework Preset**: Next.js
- **Root Directory**: ./
- **Build Command**: `npm run build`
- **Output Directory**: .next

### 5. Variáveis de Ambiente (OBRIGATÓRIO)

Para o sistema funcionar corretamente com Supabase, configure as seguintes variáveis de ambiente no Vercel:

1. No dashboard do projeto no Vercel, vá para "Settings" > "Environment Variables"
2. Adicione as seguintes variáveis:

**Banco de Dados:**
- `DATABASE_URL`: `postgresql://postgres:mrZB6plzzaTFymvP@db.sutmfzcmrlqnocsusiav.supabase.co:5432/postgres`
- `DIRECT_URL`: `postgresql://postgres:mrZB6plzzaTFymvP@db.sutmfzcmrlqnocsusiav.supabase.co:5432/postgres`

**Supabase:**
- `NEXT_PUBLIC_SUPABASE_URL`: `https://sutmfzcmrlqnocsusiav.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1dG1memNtcmxxbm9jc3VzaWF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MzgwODMsImV4cCI6MjA2NjExNDA4M30.BQRo64qRNzqB_XGNeSe4jkZ8Mzzji8eUYVbS_nWw8tI`
- `SUPABASE_SERVICE_ROLE_KEY`: [Obter do dashboard do Supabase em Settings > API]

**Autenticação JWT:**
- `JWT_SECRET`: `7kv6FyTjYf0QW1oyuQmUMhGFsag00o5YCUk0klZk6c62NNsfrkwJGgFxgDt91hSKITblW/CWAFMdhm0SeeP+pA==`

3. Certifique-se de configurar essas variáveis para todos os ambientes (Production, Preview, Development)
4. Após adicionar as variáveis, faça um novo deploy para aplicar as mudanças

**IMPORTANTE**: Sem essas variáveis de ambiente, o sistema apresentará erros 401 (Unauthorized) em todas as APIs.

### 6. Deploy

1. Clique no botão "Deploy"
2. O Vercel iniciará o processo de build e deploy
3. Você poderá acompanhar o progresso em tempo real

### 7. Acesso ao Sistema

Após a conclusão do deploy, o Vercel fornecerá um URL para acessar o sistema:
- URL padrão: `sistema-gastronomico-[hash].vercel.app`
- Você pode acessar este URL para verificar se o sistema está funcionando corretamente

## Configurações Adicionais

### Domínio Personalizado

1. No dashboard do projeto no Vercel, vá para "Settings" > "Domains"
2. Clique em "Add"
3. Digite seu domínio personalizado
4. Siga as instruções para configurar os registros DNS

### Proteção com Senha

Para ambientes de teste ou demonstração:

1. No dashboard do projeto, vá para "Settings" > "Password Protection"
2. Ative a proteção
3. Defina uma senha para acesso

### Equipe e Colaboração

Para projetos com múltiplos desenvolvedores:

1. Crie uma equipe no Vercel: "Teams" > "Create Team"
2. Convide membros da equipe
3. Transfira o projeto para a equipe

## Solução de Problemas

### Build Falhou

Se o build falhar, verifique:

1. Logs de erro no dashboard do Vercel
2. Compatibilidade das dependências no package.json
3. Se o projeto funciona localmente com `npm run build`

### Problemas de Renderização

Se o site carregar mas apresentar problemas:

1. Verifique se há erros no console do navegador
2. Confirme que o localStorage está funcionando corretamente
3. Teste em diferentes navegadores

## Manutenção e Atualizações

Para atualizar o sistema após o deploy inicial:

1. Faça as alterações no código
2. Envie para o repositório GitHub
3. O Vercel detectará automaticamente as mudanças e fará um novo deploy

Você pode configurar notificações de deploy em "Settings" > "Notifications"
