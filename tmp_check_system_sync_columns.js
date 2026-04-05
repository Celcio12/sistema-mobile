import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://dibgkabvadgblieunquq.supabase.co', 'sb_publishable_KvR5hkQMlW4nGDXikBSd9g_CsGB0ER9');
async function check() {
  try {
    const names = ['record_id', 'table_name', 'operation', 'payload', 'created_at', 'sync_key', 'syncKey', 'synckey'];
    for (const name of names) {
      const { error } = await supabase.from('system_sync').select(name).limit(1);
      console.log(`Column ${name}:`, error ? `FAIL (${error.message})` : 'OK');
    }
  } catch (err) {
    console.error('Fatal error:', err);
  }
}
check();
