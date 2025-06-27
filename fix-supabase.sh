#!/usr/bin/env bash

echo "🔍 Corrigindo supabase imports..."

# 1) Remove chamadas a supabaseBrowser()
grep -RIl "supabaseBrowser(" src/ | xargs sed -i \
  -e 's/supabaseBrowser\(\)/supabase/g'

# 2) Remove chamadas ao supabaseClient()
grep -RIl "supabaseClient" src/ | xargs sed -i \
  -e 's/const supabaseClient *= *supabase().*$/const supabase = supabase;/' \
  -e 's/supabaseClient\./supabase./g'

# 3) Remove declarações duplicadas tipo const supabase = supabase;
grep -RIl "const supabase = supabase" src/ | xargs sed -i \
  -e '/const supabase *= *supabase/d'

# 4) Padroniza import para usar createBrowserClient
grep -RIl "from .*supabase-browser" src/ | xargs sed -i \
  -e 's/import { supabase } from .*supabase-browser/import { supabase } from "\/lib\/supabase-browser"/g'

echo "✅ Ajustes concluídos. Agora execute:"
echo "    npm install && npm run build"
