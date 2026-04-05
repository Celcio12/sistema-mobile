import { useState } from 'react';
import { RefreshCcw, Search, Filter, FileText, X, Printer, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSupabaseTable } from '../../hooks/useSupabaseTable';

export default function Produtos() {
  const { data: vendas, loading } = useSupabaseTable<any>('sales');
  const { data: settingsData } = useSupabaseTable<any>('settings');
  const [selectedSale, setSelectedSale] = useState<any | null>(null);

  const currentSettings = settingsData?.find((s: any) => s.id === 'system-settings') || settingsData?.[0] || {};
  const companyName = currentSettings.name?.toUpperCase() || 'CANTINA EP';

  return (
    <div className="p-4 space-y-4 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <h2 className="text-xl font-bold text-theme-text flex items-center">
          Produtos Vendidos
        </h2>
        <div className="flex space-x-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-text-muted" />
            <input 
              type="text" 
              placeholder="Pesquisar produto..." 
              className="w-full pl-9 pr-4 py-2 bg-theme-card border border-theme-border rounded-xl text-sm text-theme-text focus:outline-none focus:ring-2 focus:ring-[#FF7A00]"
            />
          </div>
          <button className="p-2 bg-theme-card border border-theme-border rounded-xl text-theme-text-muted hover:text-theme-text">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-theme-card glass-blur rounded-3xl shadow-sm border border-theme-border overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-theme-nav/50 border-b border-theme-border text-theme-text-muted text-xs uppercase tracking-wider">
                <th className="p-4 font-bold min-w-[150px]">Produto</th>
                <th className="p-4 font-bold whitespace-nowrap">Funcionário</th>
                <th className="p-4 font-bold whitespace-nowrap">Data</th>
                <th className="p-4 font-bold whitespace-nowrap">Mês</th>
                <th className="p-4 font-bold whitespace-nowrap">Hora</th>
                <th className="p-4 font-bold whitespace-nowrap text-center">Qtd</th>
                <th className="p-4 font-bold whitespace-nowrap">Total</th>
                <th className="p-4 font-bold whitespace-nowrap text-center">Fatura</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-theme-border">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center">
                    <Loader2 className="w-8 h-8 text-[#FF7A00] animate-spin mx-auto mb-2" />
                    <p className="text-theme-text-muted">Sincronizando com o PC...</p>
                  </td>
                </tr>
              ) : vendas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-theme-text-muted">
                    Nenhum produto vendido registrado no sistema do PC.
                  </td>
                </tr>
              ) : (
                 vendas.map((sale) => {
                  // Extract data from 'sales' schema
                  const dataVenda = sale.date || sale.created_at || '';
                  let mes = '';
                  if (dataVenda) {
                    try {
                      const dateObj = new Date(dataVenda);
                      if (!isNaN(dateObj.getTime())) {
                        mes = dateObj.toLocaleString('pt-BR', { month: 'long' });
                        mes = mes.charAt(0).toUpperCase() + mes.slice(1);
                      }
                    } catch (e) {}
                  }

                  // Handle items mapping (could be string or array)
                  let produto = 'Vários Itens';
                  let qtd = '---';
                  
                  if (sale.items) {
                    if (Array.isArray(sale.items) && sale.items.length > 0) {
                      const firstItem = sale.items[0];
                      produto = firstItem.productName || firstItem.name || 'Produto';
                      qtd = String(firstItem.quantity || '1');
                      if (sale.items.length > 1) produto += ` (+${sale.items.length - 1})`;
                    } else if (typeof sale.items === 'string') {
                      produto = sale.items;
                      const match = sale.items.match(/^(\d+)x\s+(.+)$/);
                      if (match) {
                        qtd = match[1];
                        produto = match[2];
                      }
                    }
                  } else if (sale.productName || sale.produto) {
                    produto = sale.productName || sale.produto;
                    qtd = String(sale.quantity || '1');
                  }

                  const totalDisplay = sale.finalTotal || sale.total || sale.amountReceived || '0 Kz';
                  const dataFormated = dataVenda ? new Date(dataVenda).toLocaleDateString('pt-PT') : '---';
                  const horaFormated = dataVenda ? new Date(dataVenda).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : '---';

                  return (
                    <tr key={sale.id} className="hover:bg-theme-nav/30 transition-colors">
                      <td className="p-4 font-medium text-theme-text truncate max-w-[200px]">{produto}</td>
                      <td className="p-4 text-theme-text-muted whitespace-nowrap">{sale.employeeName || sale.operator || 'Sistema'}</td>
                      <td className="p-4 text-theme-text-muted whitespace-nowrap">{dataFormated}</td>
                      <td className="p-4 text-theme-text-muted whitespace-nowrap">{mes}</td>
                      <td className="p-4 text-theme-text-muted whitespace-nowrap">{horaFormated}</td>
                      <td className="p-4 text-theme-text whitespace-nowrap text-center font-medium">{qtd}</td>
                      <td className="p-4 font-bold text-theme-text whitespace-nowrap">{totalDisplay}</td>
                      <td className="p-4 whitespace-nowrap text-center">
                        <button 
                          onClick={() => setSelectedSale(sale)}
                          className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors mx-auto flex items-center justify-center"
                          title="Ver Fatura"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {!loading && vendas.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <p className="text-theme-text-muted font-medium mb-4">Aguardando novas vendas...</p>
            <button className="bg-[#FF7A00] hover:bg-[#E66A00] text-white font-medium py-2 px-4 rounded-xl flex items-center space-x-2 transition-colors">
              <RefreshCcw className="w-4 h-4" />
              <span>Atualizar</span>
            </button>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      <AnimatePresence>
        {selectedSale && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSale(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-theme-bg w-full max-w-xs rounded-[2rem] shadow-2xl relative z-10 overflow-hidden border border-theme-border flex flex-col max-h-[90vh]"
            >
              <div className="bg-theme-nav px-6 py-4 flex items-center justify-between border-b border-theme-border">
                <h3 className="font-bold text-theme-text flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-500" />
                  Fatura {selectedSale.id}
                </h3>
                <button onClick={() => setSelectedSale(null)} className="p-2 rounded-full hover:bg-theme-card text-theme-text-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto font-mono text-sm text-theme-text bg-theme-card">
                <div className="text-center mb-6 border-b border-dashed border-theme-border pb-6">
                  <h2 className="text-xl font-bold mb-1">{companyName}</h2>
                  <p className="text-xs text-theme-text-muted">NIF: {settingsData?.[0]?.nif || '5000000000'}</p>
                  <p className="text-xs text-theme-text-muted">Luanda, Angola</p>
                </div>

                <div className="space-y-1 mb-6 text-[10px] uppercase tracking-tighter">
                  <div className="flex justify-between"><span>Data:</span> <span className="font-bold">{selectedSale.date || selectedSale.data || selectedSale.created_at}</span></div>
                  <div className="flex justify-between"><span>Fatura Nº:</span> <span className="font-bold">{String(selectedSale.id).replace('V-', 'FT ')}</span></div>
                  <div className="flex justify-between"><span>Cliente:</span> <span className="font-bold">{selectedSale.customerName || selectedSale.cliente || 'Consumidor Final'}</span></div>
                  <div className="flex justify-between"><span>NIF:</span> <span className="font-bold">{selectedSale.customerNif || selectedSale.nif || '999999999'}</span></div>
                  <div className="flex justify-between pt-1 border-t border-theme-border/50"><span>Operador:</span> <span>{selectedSale.employeeName || selectedSale.funcionario || 'Caixa Central'}</span></div>
                </div>

                {(() => {
                  const totalVal = Number(selectedSale.finalTotal || selectedSale.total || 0).toLocaleString('pt-PT', { minimumFractionDigits: 2 });
                  const taxVal = Number(selectedSale.taxTotal || selectedSale.tax || 0).toLocaleString('pt-PT', { minimumFractionDigits: 2 });
                  const recVal = Number(selectedSale.amountReceived || selectedSale.total || 0).toLocaleString('pt-PT', { minimumFractionDigits: 2 });
                  const changeVal = Number(selectedSale.amountChange || 0).toLocaleString('pt-PT', { minimumFractionDigits: 2 });
                  
                  return (
                    <>
                      <div className="border-t border-b border-dashed border-theme-border py-3 mb-6">
                        <div className="flex justify-between font-bold mb-2 text-[10px] uppercase">
                          <span>Qtd x Artigo (P. Unit)</span>
                          <span>Total</span>
                        </div>
                        {(() => {
                          const items = selectedSale.items || selectedSale.itens || selectedSale.produto || '';
                          let itemsArray = [];
                          if (Array.isArray(items)) itemsArray = items;
                          else if (typeof items === 'string' && items.trim()) itemsArray = items.split(', ');
                          
                          return itemsArray;
                        })().map((item: any, idx: number) => {
                          let qty = '1';
                          let name = 'Produto';
                          let price = '0,00';
                          let itemTotal = '0,00';

                          if (typeof item === 'object' && item !== null) {
                            qty = String(item.quantity || item.qtd || '1');
                            name = item.productName || item.name || 'Produto';
                            const p = Number(item.price || item.preco || 0);
                            price = p.toLocaleString('pt-PT', { minimumFractionDigits: 2 });
                            itemTotal = (p * Number(qty)).toLocaleString('pt-PT', { minimumFractionDigits: 2 });
                          } else if (typeof item === 'string') {
                            name = item;
                            if (item.includes('x ')) {
                              const parts = item.split('x ');
                              qty = parts[0];
                              name = parts.slice(1).join('x ');
                            }
                          }

                          return (
                            <div key={idx} className="flex justify-between text-[11px] mb-2 leading-tight">
                              <span className="flex-1 pr-2">
                                <span className="font-bold">{qty}</span>x {name} 
                                <span className="text-[9px] text-theme-text-muted ml-1 italic">({price})</span>
                              </span>
                              <span className="font-bold">{itemTotal}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="space-y-1.5 text-[10px] mb-6">
                        <div className="flex justify-between text-theme-text-muted italic"><span>Total Ilíquido:</span> <span>{totalVal}</span></div>
                        <div className="flex justify-between text-theme-text-muted italic"><span>Total IVA (14%):</span> <span>{taxVal}</span></div>
                        <div className="flex justify-between font-black text-sm mt-2 pt-2 border-t border-dashed border-theme-border uppercase tracking-widest bg-theme-nav px-2 py-1 rounded-lg">
                          <span>TOTAL:</span> 
                          <span>{totalVal} Kz</span>
                        </div>
                        <div className="flex justify-between pt-4 text-theme-text-muted"><span>Valor Entregue:</span> <span>{recVal} Kz</span></div>
                        <div className="flex justify-between font-bold text-emerald-500"><span>Troco:</span> <span>{changeVal} Kz</span></div>
                      </div>
                    </>
                  );
                })()}

                <div className="text-center text-[10px] text-theme-text-muted mt-8">
                  <p>Processado por programa validado nº 00/AGT/2026</p>
                  <p className="mt-1">Obrigado pela preferência!</p>
                </div>
              </div>

              <div className="p-4 bg-theme-nav border-t border-theme-border flex justify-between items-center">
                <span className="text-xs font-bold text-theme-text-muted uppercase tracking-wider flex items-center">
                  <Printer className="w-4 h-4 mr-1" /> <span>58mm / 80mm</span>
                </span>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                  Imprimir 2ª Via
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
