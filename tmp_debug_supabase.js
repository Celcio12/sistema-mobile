import { supabase } from './src/lib/supabase.ts';

async function checkData() {
  console.log('--- DIAGNÓSTICO DE DADOS ---');
  
  // 1. Verificar TUDO na system_sync sem filtros
  const { data: allData, error: allErr } = await supabase
    .from('system_sync')
    .select('synckey, table_name, record_id')
    .limit(10);

  if (allErr) {
    console.error('Erro ao ler system_sync:', allErr);
  } else {
    console.log('Amostra de dados em system_sync (primeiros 10):');
    console.table(allData);
  }

  // 2. Verificar se existe o syncKey específico
  const TARGET_KEY = '1ee0e3e8-af4c-49f5-8d86-4b80fce48cdd';
  const { count, error: countErr } = await supabase
    .from('system_sync')
    .select('*', { count: 'exact', head: true })
    .eq('synckey', TARGET_KEY);

  if (countErr) {
    console.error('Erro ao contar por synckey:', countErr);
  } else {
    console.log(`Registos com synckey "${TARGET_KEY}":`, count);
  }

  // 3. Verificar nomes de tabelas disponíveis
  const { data: tableNames, error: nameErr } = await supabase
    .from('system_sync')
    .select('table_name');

  if (!nameErr && tableNames) {
    const uniqueTables = [...new Set(tableNames.map(t => t.table_name))];
    console.log('Tabelas (table_name) encontradas na DB:', uniqueTables);
  }

  // 4. Verificar tabelas directas
  const directTables = ['vendas', 'produtos', 'funcionarios', 'configuracoes'];
  for (const table of directTables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`Tabela "${table}": Erro ou não existe (${error.message})`);
    } else {
      console.log(`Tabela "${table}": ${count} registos encontrados.`);
    }
  }
}

checkData();
