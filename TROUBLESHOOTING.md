# Troubleshooting Guide - Categorias não aparecem

## Verificação Passo a Passo

### 1. Verificar dados no Supabase
```bash
node scripts/diagnose-categories.js
```

### 2. Verificar autenticação
- Faça login com: rba1807@gmail.com / Rb180780@
- Verifique se o token está salvo no localStorage do navegador
- Abra DevTools → Application → Local Storage → auth_token

### 3. Verificar console do navegador
- Abra DevTools → Console
- Navegue para Configurações → Categorias de Produtos
- Procure por mensagens de erro ou logs de carregamento

### 4. Limpar cache do navegador
- Ctrl+Shift+R (hard refresh)
- Ou limpar completamente o cache do navegador

### 5. Verificar ambiente
- Confirme que está usando a branch: devin/1750587632-fix-remaining-authentication-issues
- Confirme que o servidor está rodando: npm run dev
- Confirme que as variáveis de ambiente estão corretas no .env.local

## Logs Esperados (Console do Navegador)
```
🔍 Buscando categorias de produtos...
📡 Response status: 200
✅ Categorias carregadas: 8
```

## Se o problema persistir
1. Compartilhe os logs do console do navegador
2. Compartilhe o resultado do script diagnose-categories.js
3. Informe qual navegador está usando
4. Informe se o problema ocorre em modo incógnito

## Comandos de Diagnóstico Adicionais

### Verificar conectividade com Supabase
```bash
curl -I https://sutmfzcmrlqnocsusiav.supabase.co
```

### Verificar tabelas no banco
```bash
npx prisma studio
```

### Resetar dados de categorias
```bash
node scripts/seed-categorias-produtos.js
node scripts/seed-categorias-receitas.js
```

### Verificar logs do servidor
```bash
npm run dev
```
Procure por erros relacionados a autenticação ou conexão com banco de dados.
