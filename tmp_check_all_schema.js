import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://dibgkabvadgblieunquq.supabase.co', 'sb_publishable_KvR5hkQMlW4nGDXikBSd9g_CsGB0ER9');
async function check() {
  try {
    const tables = ['system_sync', 'notifications', 'vendas', 'stock', 'funcionarios', 'company_info'];
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (data && data.length > 0) {
        console.log(`Table ${table} columns:`, Object.keys(data[0]));
      } else if (error) {
        console.log(`Table ${table} error:`, error.message);
      } else {
        console.log(`Table ${table} is empty`);
      }
    }
  } catch (err) {
    console.error('Fatal error:', err);
  }
}
check();
