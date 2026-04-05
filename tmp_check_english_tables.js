import { supabase } from './src/lib/supabase.ts';

async function checkEnglishTables() {
  console.log('--- DIAGNÓSTICO TABELAS INGLÊS ---');
  
  const tables = ['products', 'employees', 'sales', 'clients', 'settings', 'system_sync'];

  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`Tabela "${table}": Erro (${error.message})`);
    } else {
      console.log(`Tabela "${table}": ${count} registos.`);
    }
  }

  // Verificar se existem dados em system_sync mas com outros table_name
  const { data: syncRows } = await supabase.from('system_sync').select('table_name, synckey').limit(10);
  console.log('Dados em system_sync (sem filtro):', syncRows);
}

checkEnglishTables();
