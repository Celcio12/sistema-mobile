import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

// Chave de Segurança (opcional para tabelas directas sem esta coluna)
const SYNC_KEY = '1ee0e3e8-af4c-49f5-8d86-4b80fce48cdd';

// Intervalo de polling de fallback (ms)
const POLLING_INTERVAL_MS = 5000;

// Tabelas que devem ser lidas DIRECTAMENTE (sem passar pela system_sync)
const DIRECT_TABLES = ['products', 'employees', 'sales', 'settings', 'clients', 'notifications', 'purchases', 'access_logs', 'fiscal_logs'];

/**
 * Normaliza os dados vindos do Supabase.
 * Se vier da system_sync, extrai o payload.
 * Se vier directamente, usa o objecto como está.
 */
function normalizeData(row: any, isFromSync: boolean): any {
  if (!row) return null;
  
  if (isFromSync) {
    const payloadData =
      typeof row.payload === 'string'
        ? (() => { try { return JSON.parse(row.payload); } catch { return {}; } })()
        : (row.payload || {});
    return {
      ...payloadData,
      id: payloadData.id ?? row.record_id ?? row.id,
      _sync_id: row.id,
      _is_sync: true
    };
  }

  // Se for directo, apenas garante que tem um ID
  return {
    ...row,
    id: row.id || row.record_id || Math.random().toString(36).substr(2, 9)
  };
}

export function useSupabaseTable<T>(tableName: string) {
  const [data, setData]       = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<Error | null>(null);
  const isDirect              = DIRECT_TABLES.includes(tableName);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async (isInitial = false) => {
      try {
        if (isInitial) {
          setLoading(true);
        }
        
        let query;

        if (isDirect) {
          // LER DIRECTO (ex: tabela 'products')
          query = supabase.from(tableName).select('*').eq('syncKey', SYNC_KEY);
        } else {
          // LER VIA SYNC (ex: para sistemas legados que usem system_sync)
          query = supabase
            .from('system_sync')
            .select('*')
            .eq('syncKey', SYNC_KEY)
            .eq('table_name', tableName)
            .order('created_at', { ascending: false });
        }

        const { data: rows, error: fetchError } = await query;

        if (fetchError) {
          if (fetchError.code === '42P01') { // Tabela não existe
            if (isMounted) setData([]);
            return;
          }
          throw fetchError;
        }

        const normalized = (rows || []).map(r => normalizeData(r, !isDirect)).filter(Boolean);
        if (isMounted) {
          setData(normalized as T[]);
          // console.log(`✅ [${tableName}] ${normalized.length} registos`);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          console.error(`❌ [${tableName}] Erro:`, err);
        }
      } finally {
        if (isMounted && isInitial) setLoading(false);
      }
    };

    fetchData(true); // Initial load with loading state

    // ── Realtime Setup ──────────────────────────────────────────────
    const channelName = isDirect ? `direct:${tableName}` : `sync:${tableName}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: isDirect ? tableName : 'system_sync',
          // Filtro de syncKey para todas as tabelas para garantir segurança de dados por cliente
          filter: `syncKey=eq.${SYNC_KEY}`,
        },
        (payload) => {
          if (!isMounted) return;

          const newRow = payload.new as any;
          const oldRow = payload.old as any;

          // Se for via sync, verificar se o table_name corresponde
          if (!isDirect && (newRow?.table_name || oldRow?.table_name) !== tableName) return;

          console.log(`🔔 [REALTIME ${tableName}] ${payload.eventType}`);

          if (payload.eventType === 'INSERT') {
            const item = normalizeData(newRow, !isDirect);
            if (item) setData((prev) => [item as T, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const item = normalizeData(newRow, !isDirect);
            if (item) setData((prev: any) => 
              prev.map((e: any) => (e.id === item.id) ? (item as T) : e)
            );
          } else if (payload.eventType === 'DELETE') {
            const idToRemove = oldRow?.id;
            if (idToRemove) setData((prev: any) => 
              prev.filter((e: any) => e.id !== idToRemove)
            );
          }
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.warn(`⚠️ [${tableName}] Realtime falhou. Usando polling.`);
        }
      });

    // ── Polling Fallback ───────────────────────────────────────────
    const pollId = setInterval(() => fetchData(false), POLLING_INTERVAL_MS); // Background updates only

    return () => {
      isMounted = false;
      clearInterval(pollId);
      supabase.removeChannel(channel);
    };
  }, [tableName, isDirect]);

  return { data, loading, error };
}
