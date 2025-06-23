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
node scripts/seed-unidades.js
```

### Verificar logs do servidor
```bash
npm run dev
```
Procure por erros relacionados a autenticação ou conexão com banco de dados.

## Problemas Específicos do Vercel

### Erro 401 em Todas as APIs (Ambiente de Produção)

**Sintoma**: Todas as chamadas de API retornam status 401 (Unauthorized) no ambiente deployado

**Causa**: Variáveis de ambiente não configuradas no Vercel

**Solução**:
1. Acesse o dashboard do seu projeto no Vercel
2. Vá para "Settings" > "Environment Variables"
3. Configure todas as variáveis listadas na seção "Variáveis de Ambiente" do arquivo `docs/deploy-vercel.md`
4. Certifique-se de que `JWT_SECRET` está configurado corretamente
5. Faça um novo deploy após configurar as variáveis

### Verificar Configuração de Ambiente no Vercel
```bash
# Execute este script para verificar se as variáveis estão carregadas
node scripts/verify-environment.js
```

### Logs Esperados Após Configuração
```
✅ JWT_SECRET exists: true
✅ JWT_SECRET length: 87
✅ JWT functionality working correctly
✅ Test token generated and verified successfully
```

### Erro 500 em /api/auth/users

**Sintoma**: Endpoint `/api/auth/users` retorna erro 500 Internal Server Error

**Causa**: Problemas de conexão com banco de dados ou JWT_SECRET ausente

**Solução**:
1. Verifique se `DATABASE_URL` está configurado no Vercel
2. Verifique se `JWT_SECRET` está configurado no Vercel
3. Execute o script de verificação: `node scripts/verify-environment.js`
4. Verifique logs do Vercel para detalhes do erro

### Verificar Ambiente Local vs Produção

**Local (funcionando)**:
- JWT_SECRET carregado do arquivo `.env.local`
- Todas as APIs retornam status 200
- Login funciona corretamente

**Vercel (com problemas)**:
- JWT_SECRET não configurado nas variáveis de ambiente
- Todas as APIs retornam status 401
- Redirecionamento automático para página de login

### Endpoint de Verificação de Saúde

Acesse `/api/health` para verificar o status das variáveis de ambiente:

**Local**: `http://localhost:3000/api/health`
**Produção**: `https://seu-projeto.vercel.app/api/health`

**Resposta esperada após configuração**:
```json
{
  "status": "ok",
  "environment": {
    "JWT_SECRET_CONFIGURED": true,
    "JWT_FUNCTIONALITY": "working",
    "DATABASE_URL_CONFIGURED": true,
    "SUPABASE_URL_CONFIGURED": true,
    "SUPABASE_ANON_KEY_CONFIGURED": true
  }
}
```
