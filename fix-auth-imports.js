const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, 'src/app');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  if (filePath.includes('/api/')) {
    // Para rotas API
    if (content.includes(`from '@/lib/auth'`)) {
      content = content.replace(
        /import\s+\{\s*(supabase,?\s*)?(requireRole)?\s*\}\s+from\s+'@\/lib\/auth'/g,
        "import { requireRole } from '@/lib/authServer'"
      );
      modified = true;
    }
  } else {
    // Para páginas de cliente
    if (content.includes(`from '@/lib/auth'`)) {
      content = content.replace(
        /import\s+\{\s*supabase\s*\}\s+from\s+'@\/lib\/auth'/g,
        "import { supabase } from '@/lib/authClient'"
      );
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Corrigido: ${filePath}`);
  }
}

// Executar
walkDir(BASE_DIR, fixImports);
