import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://dibgkabvadgblieunquq.supabase.co', 'sb_publishable_KvR5hkQMlW4nGDXikBSd9g_CsGB0ER9');
async function check() {
  try {
    // Try to get columns using a trick if rpc is not available
    // Postgrest allows to get column info sometimes? No.
    // Try common names
    const names = ['syncKey', 'sync_key', 'synckey', 'sync_id', 'syncid', 'id_sincronizacao', 'pckey', 'pc_key'];
    for (const name of names) {
      const { error } = await supabase.from('system_sync').select(name).limit(1);
      console.log(`Column ${name}:`, error ? 'FAIL' : 'OK');
      if (!error) break;
    }
  } catch (err) {
    console.error('Fatal error:', err);
  }
}
check();
