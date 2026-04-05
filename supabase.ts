import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL     = 'https://dibgkabvadgblieunquq.supabase.co';
const SUPABASE_ANON    = 'sb_publishable_KvR5hkQMlW4nGDXikBSd9g_CsGB0ER9';
export const SYNC_KEY  = '1ee0e3e8-af4c-49f5-8d86-4b80fce48cdd';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    persistSession:     false,
    autoRefreshToken:   false,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// ─────────────────────────────────────────────────────────────
// Testa a ligação à tabela system_sync e imprime diagnóstico
// ─────────────────────────────────────────────────────────────
export const testSupabaseConnection = async (): Promise<boolean> => {
  console.log('🔍 [Supabase] A testar ligação...');
  console.log('   URL:', SUPABASE_URL);
  console.log('   Sync Key:', SYNC_KEY);

  try {
    const { data, error } = await supabase
      .from('system_sync')
      .select('id, table_name, syncKey')
      .eq('syncKey', SYNC_KEY)
      .limit(5);

    if (error) {
      // Diagnóstico por tipo de erro
      if (error.code === '42P01') {
        console.error('❌ [Supabase] Tabela "system_sync" não existe ainda.');
        console.error('   Solução: O PC ainda não criou a tabela ou o schema está errado.');
      } else if (error.code === '42501' || error.message?.includes('permission')) {
        console.error('❌ [Supabase] Erro de permissão (RLS).');
        console.error('   Solução: No Dashboard → Authentication → Policies → system_sync → Criar policy "Enable all for anon".');
      } else if (error.message?.includes('JWT') || error.message?.includes('401')) {
        console.error('❌ [Supabase] Anon Key inválida ou expirada.');
        console.error('   Solução: Copie a chave correta em supabase.co → Settings → API.');
      } else if (!navigator.onLine) {
        console.error('❌ [Supabase] Sem ligação à Internet.');
      } else {
        console.error('❌ [Supabase] Erro desconhecido:', error);
      }
      return false;
    }

    const tableNames = [...new Set((data || []).map((r: any) => r.table_name))];
    console.log(`✅ [Supabase] Ligação OK. ${data?.length ?? 0} registos encontrados.`);
    console.log('   Tabelas sincronizadas:', tableNames.length ? tableNames.join(', ') : '(nenhuma)');

    if ((data?.length ?? 0) === 0) {
      console.warn('⚠️ [Supabase] Tabela vazia. O PC ainda não enviou dados com este syncKey.');
    }

    return true;
  } catch (err: any) {
    if (!navigator.onLine || err?.message?.includes('fetch')) {
      console.error('❌ [Supabase] ERRO DE REDE — Verifique a ligação à Internet.');
    } else {
      console.error('❌ [Supabase] Erro geral:', err);
    }
    return false;
  }
};
