import { TrendingUp, DollarSign, PieChart, Download, FileSpreadsheet, FileCode2, Loader2, CreditCard, Banknote, Trophy, Calendar, Activity, Package } from 'lucide-react';
import { useSupabaseTable } from '../../hooks/useSupabaseTable';

export default function RelatoriosLucro() {
  const { data: vendas, loading } = useSupabaseTable<any>('sales');

  // Calculate totals from real sales data
  const totalFaturacao = vendas.reduce((acc, venda) => {
    return acc + (Number(venda.finalTotal || venda.total) || 0);
  }, 0);

  const totalIva = vendas.reduce((acc, venda) => {
    return acc + (Number(venda.taxTotal || venda.iva || venda.vat) || 0);
  }, 0);

  const lucroLiquido = totalFaturacao - totalIva;
  const lucroDiario = lucroLiquido * 0.05;
  const lucroAnual = lucroLiquido * 12;
  const totalVendasCount = vendas.length;

  // Real payment methods from sales data
  const pagamentosDinheiro = vendas.reduce((acc, v) => {
    const method = (v.paymentMethod || '').toLowerCase();
    return acc + (method === 'dinheiro' || method === 'cash' ? Number(v.finalTotal || v.total || 0) : 0);
  }, 0);
  const pagamentosCartao = vendas.reduce((acc, v) => {
    const method = (v.paymentMethod || '').toLowerCase();
    return acc + (method !== 'dinheiro' && method !== 'cash' && method !== '' ? Number(v.finalTotal || v.total || 0) : 0);
  }, 0);
  const paymentTotal = pagamentosDinheiro + pagamentosCartao || 1;
  const dinheiroPercent = Math.round((pagamentosDinheiro / paymentTotal) * 100);
  const cartaoPercent = 100 - dinheiroPercent;

  // Real top products ranking from sales items
  const productMap = new Map<string, { name: string; count: number; total: number }>();
  vendas.forEach((venda) => {
    const items = venda.items;
    if (!items) return;
    const itemsArr = Array.isArray(items) ? items : [];
    itemsArr.forEach((item: any) => {
      const name = item.productName || item.name || 'Produto';
      const qty = Number(item.quantity || item.qtd || 1);
      const price = Number(item.price || item.preco || 0);
      const existing = productMap.get(name) || { name, count: 0, total: 0 };
      productMap.set(name, { name, count: existing.count + qty, total: existing.total + (price * qty) });
    });
  });
  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value).replace('AOA', 'Kz');
  };

  return (
    <div className="p-4 space-y-4 h-full flex flex-col pb-20 overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-theme-text flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-emerald-500" />
          Relatórios & Lucro
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-2">
        <button className="flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold py-2 rounded-xl transition-colors text-[10px] uppercase tracking-wider">
          <Download className="w-3 h-3 mr-1" /> PDF
        </button>
        <button className="flex items-center justify-center bg-green-500/10 hover:bg-green-500/20 text-green-500 font-bold py-2 rounded-xl transition-colors text-[10px] uppercase tracking-wider">
          <FileSpreadsheet className="w-3 h-3 mr-1" /> Excel
        </button>
        <button className="flex items-center justify-center bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 font-bold py-2 rounded-xl transition-colors text-[10px] uppercase tracking-wider">
          <FileCode2 className="w-3 h-3 mr-1" /> XML
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-theme-card glass-blur rounded-3xl border border-theme-border">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-2" />
          <p className="text-theme-text-muted">Calculando finanças...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Main Profit Card */}
          <div className="bg-[#1A2235] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
            <span className="text-white/70 text-sm font-medium block mb-1">Lucro Líquido da Empresa</span>
            <h3 className="text-4xl font-black tracking-tight">{formatCurrency(lucroLiquido)}</h3>
            <div className="mt-4 flex items-center text-emerald-400 text-sm font-bold">
              <Activity className="w-4 h-4 mr-1" />
              Sincronizado em tempo real
            </div>
          </div>

          {/* Key Indicators Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-theme-card glass-blur p-4 rounded-3xl shadow-sm border border-theme-border">
              <div className="bg-blue-500/10 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                <DollarSign className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-xs text-theme-text-muted font-bold uppercase tracking-wider block mb-1">Total Faturação</span>
              <span className="text-lg font-bold text-theme-text">{formatCurrency(totalFaturacao)}</span>
            </div>
            <div className="bg-theme-card glass-blur p-4 rounded-3xl shadow-sm border border-theme-border">
              <div className="bg-[#FF7A00]/10 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                <Package className="w-5 h-5 text-[#FF7A00]" />
              </div>
              <span className="text-xs text-theme-text-muted font-bold uppercase tracking-wider block mb-1">Total de Vendas</span>
              <span className="text-lg font-bold text-theme-text">{totalVendasCount} Registos</span>
            </div>
          </div>

          {/* Time-based Profit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-theme-card glass-blur p-4 rounded-3xl shadow-sm border border-theme-border">
              <div className="flex items-center mb-2">
                <Calendar className="w-4 h-4 text-emerald-500 mr-2" />
                <span className="text-xs text-theme-text-muted font-bold uppercase tracking-wider">Lucro Diário</span>
              </div>
              <span className="text-base font-bold text-theme-text">{formatCurrency(lucroDiario)}</span>
            </div>
            <div className="bg-theme-card glass-blur p-4 rounded-3xl shadow-sm border border-theme-border">
              <div className="flex items-center mb-2">
                <Calendar className="w-4 h-4 text-blue-500 mr-2" />
                <span className="text-xs text-theme-text-muted font-bold uppercase tracking-wider">Lucro Anual</span>
              </div>
              <span className="text-base font-bold text-theme-text">{formatCurrency(lucroAnual)}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-theme-card glass-blur rounded-3xl p-5 shadow-sm border border-theme-border">
            <h3 className="font-bold text-theme-text mb-4 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-theme-text-muted" />
              Métodos de Pagamento
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-theme-text-muted flex items-center"><Banknote className="w-4 h-4 mr-1 text-emerald-500" /> <span>Dinheiro</span></span>
                  <span className="font-bold text-theme-text">{formatCurrency(pagamentosDinheiro)} ({dinheiroPercent}%)</span>
                </div>
                <div className="w-full bg-theme-nav rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${dinheiroPercent}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-theme-text-muted flex items-center"><CreditCard className="w-4 h-4 mr-1 text-blue-500" /> <span>Cartão / TPA / Outro</span></span>
                  <span className="font-bold text-theme-text">{formatCurrency(pagamentosCartao)} ({cartaoPercent}%)</span>
                </div>
                <div className="w-full bg-theme-nav rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${cartaoPercent}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Top 5 Produtos — Ranking de Vendas com dados reais */}
          <div className="bg-theme-card glass-blur rounded-3xl p-5 shadow-sm border border-theme-border">
            <h3 className="font-bold text-theme-text mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-[#FF7A00]" />
              Top 5 Produtos — Ranking de Vendas
            </h3>
            {topProducts.length === 0 ? (
              <div className="text-center py-6 text-theme-text-muted text-sm">
                <Trophy className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>Sem dados de produtos ainda</p>
                <p className="text-xs mt-1 opacity-60">Os dados aparecerão quando houver vendas com itens registados no PC.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topProducts.map((product, index) => {
                  const rank = index + 1;
                  return (
                    <div key={product.name} className="flex items-center justify-between p-3 bg-theme-nav rounded-2xl border border-theme-border">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white mr-3 text-sm ${
                          rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-slate-400' : rank === 3 ? 'bg-amber-700' : 'bg-theme-border text-theme-text'
                        }`}>
                          {rank}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-theme-text">{product.name}</p>
                          <p className="text-xs text-theme-text-muted">{product.count} vendas</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-theme-text">{formatCurrency(product.total)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
