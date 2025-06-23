const jwt = require('jsonwebtoken');

console.log('=== Environment Variables Diagnostic ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('NEXT_PHASE:', process.env.NEXT_PHASE);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length || 0);
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log('SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

if (process.env.JWT_SECRET) {
  try {
    const testPayload = { userId: 'test', email: 'test@test.com', role: 'admin' };
    const token = jwt.sign(testPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ JWT functionality working correctly');
    console.log('✅ Test token generated and verified successfully');
  } catch (error) {
    console.log('❌ JWT functionality failed:', error.message);
  }
} else {
  console.log('❌ JWT_SECRET not available - authentication will fail');
  console.log('❌ All API calls will return 401 Unauthorized');
}

console.log('\n=== Database Connection Test ===');
if (process.env.DATABASE_URL) {
  console.log('✅ DATABASE_URL configured');
  console.log('Database host:', process.env.DATABASE_URL.includes('sutmfzcmrlqnocsusiav') ? 'Supabase ✅' : 'Unknown');
} else {
  console.log('❌ DATABASE_URL not configured');
}

console.log('\n=== Supabase Configuration Test ===');
if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.log('✅ Supabase configuration complete');
} else {
  console.log('❌ Supabase configuration incomplete');
}
