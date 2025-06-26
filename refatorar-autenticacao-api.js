const fs = require('fs')
const path = require('path')

const apiRoot = path.join(__dirname, 'src', 'app', 'api')

function processarArquivo(filePath) {
  let conteudo = fs.readFileSync(filePath, 'utf-8')

  const usaTokenManual = conteudo.includes("authorization") && conteudo.includes("supabase.auth.getUser")

  if (!usaTokenManual) {
    console.log(`🟡 Ignorado: ${filePath}`)
    return
  }

  // Remover código antigo
  conteudo = conteudo.replace(
    /const token = req\.headers\.get\(['"]authorization['"]\)\?.*?\n/, ''
  )
  conteudo = conteudo.replace(
    /await supabase\.auth\.getUser\(token\)/g,
    'await supabase.auth.getUser()'
  )

  // Inserir imports
  if (!conteudo.includes("import { cookies } from 'next/headers'")) {
    conteudo = `import { cookies } from 'next/headers'\n` + conteudo
  }
  if (!conteudo.includes("createServerClient")) {
    conteudo = `import { createServerClient } from '@supabase/ssr'\n` + conteudo
  }

  // Substituir criação manual do supabase, se necessário
  conteudo = conteudo.replace(
    /const supabase = .*?\n/g,
    `const supabase = createServerClient({ cookies })\n`
  )

  fs.writeFileSync(filePath, conteudo, 'utf-8')
  console.log(`✅ Atualizado: ${filePath}`)
}

function percorrerPastas(pasta) {
  const itens = fs.readdirSync(pasta)

  for (const item of itens) {
    const fullPath = path.join(pasta, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      percorrerPastas(fullPath)
    } else if (item === 'route.ts') {
      processarArquivo(fullPath)
    }
  }
}

console.log('🔍 Iniciando refatoração de autenticação nas rotas API...\n')
percorrerPastas(apiRoot)
console.log('\n✅ Finalizado.')
