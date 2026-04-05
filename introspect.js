const supabaseUrl = 'https://dibgkabvadgblieunquq.supabase.co';
const supabaseAnonKey = 'sb_publishable_KvR5hkQMlW4nGDXikBSd9g_CsGB0ER9';

async function introspect() {
  const res = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseAnonKey}`);
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

introspect();
