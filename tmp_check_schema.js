import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://dibgkabvadgblieunquq.supabase.co', 'sb_publishable_KvR5hkQMlW4nGDXikBSd9g_CsGB0ER9');
async function check() {
  try {
    const { data: n, error: ne } = await supabase.from('notifications').select('*').limit(1);
    if (n && n.length > 0) {
      console.log('Notifications columns:', Object.keys(n[0]));
    } else {
      console.log('Notifications error or empty:', ne || 'empty');
    }
    
    const { data: s, error: se } = await supabase.from('system_sync').select('*').limit(1);
    if (s && s.length > 0) {
      console.log('System_sync columns:', Object.keys(s[0]));
    } else {
      console.log('System_sync error or empty:', se || 'empty');
    }
  } catch (err) {
    console.error('Fatal error:', err);
  }
}
check();
