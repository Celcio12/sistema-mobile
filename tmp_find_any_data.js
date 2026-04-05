import { supabase } from './src/lib/supabase.ts';

async function findData() {
  console.log('--- BUSCA GLOBAL DE TABELAS ---');
  
  // No Supabase, não temos acesso directo ao pg_catalog via API REST por segurança.
  // Vamos tentar nomes comuns de tabelas que o utilizador possa ter usado.
  const tables = [
    'system_sync', 'vendas', 'produtos', 'funcionarios', 'configuracoes', 
    'alertas', 'stock', 'users', 'profiles', 'company', 'settings'
  ];

  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (!error) {
      console.log(`Tabela "${table}": ${count} registos.`);
    }
  }

  // Tentar listar as colunas da system_sync para ver se o nome do syncKey está mesmo correcto
  const { data: sample } = await supabase.from('system_sync').select('*').limit(1);
  if (sample && sample.length > 0) {
    console.log('Campos da system_sync:', Object.keys(sample[0]));
  } else {
    console.log('Não foi possível obter campos (tabela vazia).');
  }
}

findData();
