import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PlusCircle, 
  Calendar, 
  Trash2, 
  PieChart, 
  Table 
} from 'lucide-react';

export default function FinanceDashboard() {
  const [periodo, setPeriodo] = useState('semanal'); // 'semanal' ou 'quinzenal'
    const [transacoes, setTransacoes] = useState([
    { id: 1, descricao: 'Venda de Serviços', valor: 3500.00, tipo: 'entrada', periodo: 'semanal', data: '2026-08-24' },
    { id: 2, descricao: 'Compra de Material', valor: 1200.00, tipo: 'saida', periodo: 'semanal', data: '2026-08-23' },
    { id: 3, descricao: 'Manutenção de Equipamento', valor: 450.00, tipo: 'saida', periodo: 'semanal', data: '2026-08-22' },
    { id: 4, descricao: 'Contrato Mensal - Parcela 1', valor: 8000.00, tipo: 'entrada', periodo: 'quinzenal', data: '2026-08-15' },
    { id: 5, descricao: 'Pagamento de Fornecedores', valor: 3200.00, tipo: 'saida', periodo: 'quinzenal', data: '2026-08-18' },
    { id: 6, descricao: 'Licenças de Software', valor: 600.00, tipo: 'saida', periodo: 'quinzenal', data: '2026-08-20' },
  ]);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('entrada');
  const transacoesFiltradas = transacoes.filter(t => t.periodo === periodo);

  const totalEntradas = transacoesFiltradas
    .filter(t => t.tipo === 'entrada')
    .reduce((acc, t) => acc + t.valor, 0);

  const totalSaidas = transacoesFiltradas
    .filter(t => t.tipo === 'saida')
    .reduce((acc, t) => acc + t.valor, 0);

  const saldoTotal = totalEntradas - totalSaidas;
  const ehLucro = saldoTotal >= 0;
  const porcentagemGastos = totalEntradas > 0 ? Math.min((totalSaidas / totalEntradas) * 100, 100) : 0;

  const handleAdicionar = (e) => {
    e.preventDefault();
    if (!descricao || !valor) return;

    const novaTransacao = {
      id: Date.now(),
      descricao,
      valor: parseFloat(valor),
      tipo,
      periodo,
      data: new Date().toISOString().split('T')[0],
    };

    setTransacoes([novaTransacao, ...transacoes]);
    setDescricao('');
    setValor('');
  };

  const handleRemover = (id) => {
    setTransacoes(transacoes.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans selection:bg-blue-500/30 selection:text-white motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight truncate">Painel Financeiro</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 truncate">Gestão simplificada de entradas, saídas e lucros.</p>
          </div>

          <div className="inline-flex bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 shadow-sm shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setPeriodo('semanal')}
              className={`flex min-h-10 items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold select-none
                transition-all duration-150 ease-out
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                motion-safe:active:scale-95 motion-reduce:transition-none ${
                periodo === 'semanal'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/40'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Visão Semanal</span>
            </button>
            <button
              type="button"
              onClick={() => setPeriodo('quinzenal')}
              className={`flex min-h-10 items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold select-none
                transition-all duration-150 ease-out
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                motion-safe:active:scale-95 motion-reduce:transition-none ${
                periodo === 'quinzenal'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/40'
              }`}
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span>Visão Quinzenal</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="group relative overflow-hidden bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 sm:p-5 shadow-sm select-none
            transition-all duration-200 ease-out
            hover:border-slate-600 hover:bg-slate-800 hover:shadow-md
            motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none">
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-400 text-xs sm:text-sm font-medium truncate">Entradas ({periodo})</span>
              <div className="p-2 bg-emerald-500/10 rounded-xl shrink-0 transition-transform duration-200 ease-out motion-safe:group-hover:scale-110">
                <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 mt-3 truncate tabular-nums">
              R$ {totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="group relative overflow-hidden bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 sm:p-5 shadow-sm select-none
            transition-all duration-200 ease-out
            hover:border-slate-600 hover:bg-slate-800 hover:shadow-md
            motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none">
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-400 text-xs sm:text-sm font-medium truncate">Saídas ({periodo})</span>
              <div className="p-2 bg-rose-500/10 rounded-xl shrink-0 transition-transform duration-200 ease-out motion-safe:group-hover:scale-110">
                <TrendingDown className="w-5 h-5 text-rose-400 shrink-0" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-mono font-bold text-rose-400 mt-3 truncate tabular-nums">
              R$ {totalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="group relative overflow-hidden col-span-1 sm:col-span-2 md:col-span-1 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 sm:p-5 shadow-sm select-none
            transition-all duration-200 ease-out
            hover:border-slate-600 hover:bg-slate-800 hover:shadow-md
            motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none">
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-400 text-xs sm:text-sm font-medium truncate">Resultado Líquido</span>
              <div className={`p-2 rounded-xl shrink-0 transition-transform duration-200 ease-out motion-safe:group-hover:scale-110 ${ehLucro ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                <DollarSign className={`w-5 h-5 shrink-0 ${ehLucro ? 'text-emerald-400' : 'text-rose-400'}`} />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between sm:justify-start gap-2 min-w-0">
              <p className={`text-2xl sm:text-3xl font-mono font-bold truncate tabular-nums ${ehLucro ? 'text-emerald-400' : 'text-rose-400'}`}>
                R$ {saldoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              <span className={`text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 transition-colors duration-200 ${
                ehLucro ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
              }`}>
                {ehLucro ? 'LUCRO' : 'PREJUÍZO'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-400 shrink-0" />
              <span>Novo Registro ({periodo})</span>
            </h2>

            <form onSubmit={handleAdicionar} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Descrição</label>
                <input
                  type="text"
                  placeholder="Ex: Venda de produto, Aluguel..."
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-[16px] sm:text-sm text-white placeholder:text-slate-500
                    transition-all duration-150 ease-out
                    focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-3.5 py-2.5 font-mono text-[16px] sm:text-sm text-white placeholder:text-slate-500
                    transition-all duration-150 ease-out
                    focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Tipo de Movimentação</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setTipo('entrada')}
                    className={`min-h-11 py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl border select-none
                      transition-all duration-150 ease-out
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
                      motion-safe:active:scale-[0.98] motion-reduce:transition-none ${
                      tipo === 'entrada'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-sm'
                        : 'bg-slate-900/80 border-slate-700/80 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                    }`}
                  >
                    + Entrada
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipo('saida')}
                    className={`min-h-11 py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl border select-none
                      transition-all duration-150 ease-out
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500
                      motion-safe:active:scale-[0.98] motion-reduce:transition-none ${
                      tipo === 'saida'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-sm'
                        : 'bg-slate-900/80 border-slate-700/80 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                    }`}
                  >
                    - Saída
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!descricao || !valor}
                className="w-full min-h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl text-xs sm:text-sm shadow-md shadow-blue-600/20 select-none
                  transition-all duration-150 ease-out mt-2
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
                  motion-safe:active:scale-[0.98]
                  disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-blue-600 disabled:shadow-none disabled:active:scale-100
                  motion-reduce:transition-none"
              >
                Salvar Lançamento
              </button>
            </form>
          </div>
          <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 flex flex-col justify-between shadow-sm">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-400 shrink-0" />
                <span>Saúde Financeira ({periodo})</span>
              </h2>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">Comprometimento da Receita (Gastos vs Ganho)</span>
                    <span className="text-slate-200 font-mono font-bold">{porcentagemGastos.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700/80">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${
                        porcentagemGastos > 80 ? 'bg-rose-500' : porcentagemGastos > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${porcentagemGastos}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/40">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Entradas</span>
                      <span className="text-emerald-400 font-mono font-bold">100%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-400 h-full w-full rounded-full"></div>
                    </div>
                  </div>
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/40">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Saídas Relativas</span>
                      <span className="text-rose-400 font-mono font-bold">{porcentagemGastos.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-rose-400 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${porcentagemGastos}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 p-3.5 bg-slate-900/40 rounded-xl border border-slate-800 text-xs text-slate-400">
              💡 <span className="text-slate-300 font-semibold">Dica de uso:</span> Alterne na parte superior para visualizar os cálculos adaptados para o fechamento semanal ou quinzenal do seu pai.
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 shadow-sm overflow-hidden">
          <h2 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Table className="w-5 h-5 text-blue-400 shrink-0" />
            <span>Planilha de Movimentações ({periodo})</span>
          </h2>
          <div className="hidden md:block overflow-x-auto scrolling-touch">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="text-xs uppercase bg-slate-900/80 text-slate-400 border-b border-slate-700/80">
                <tr>
                  <th className="px-4 py-3.5 font-semibold rounded-l-lg">Data</th>
                  <th className="px-4 py-3.5 font-semibold">Descrição</th>
                  <th className="px-4 py-3.5 font-semibold">Tipo</th>
                  <th className="px-4 py-3.5 font-semibold">Valor</th>
                  <th className="px-4 py-3.5 text-right font-semibold rounded-r-lg">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {transacoesFiltradas.length > 0 ? (
                  transacoesFiltradas.map((t) => (
                    <tr 
                      key={t.id} 
                      className="hover:bg-slate-800/40 transition-colors duration-150 ease-out"
                    >
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-400 whitespace-nowrap">{t.data}</td>
                      <td className="px-4 py-3.5 font-medium text-white">{t.descricao}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap select-none transition-transform duration-150 motion-safe:hover:scale-[1.03] ${
                          t.tipo === 'entrada'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {t.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                        </span>
                      </td>
                      <td className={`px-4 py-3.5 font-mono font-bold whitespace-nowrap tabular-nums ${
                        t.tipo === 'entrada' ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {t.tipo === 'entrada' ? '+' : '-'} R$ {t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleRemover(t.id)}
                          className="inline-flex items-center justify-center min-h-9 min-w-9 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 
                            transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500
                            motion-safe:active:scale-95"
                          title="Excluir lançamento"
                          aria-label="Excluir lançamento"
                        >
                          <Trash2 className="w-4 h-4 shrink-0" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-slate-500 font-medium">
                      Nenhum registro encontrado para este período.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="divide-y divide-slate-800/80 md:hidden">
            {transacoesFiltradas.length > 0 ? (
              transacoesFiltradas.map((t) => (
                <div 
                  key={t.id} 
                  className="py-3.5 flex items-start justify-between gap-3 transition-colors duration-150 ease-out motion-safe:active:bg-slate-800/30"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-400">{t.data}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider select-none ${
                        t.tipo === 'entrada'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {t.tipo === 'entrada' ? 'Entrada' : 'Saída'}
                      </span>
                    </div>
                    <p className="mt-1 font-medium text-slate-200 truncate">{t.descricao}</p>
                    <p className={`mt-1 font-mono font-bold text-sm tabular-nums ${
                      t.tipo === 'entrada' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {t.tipo === 'entrada' ? '+' : '-'} R$ {t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemover(t.id)}
                    className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 
                      transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500
                      motion-safe:active:scale-95"
                    title="Excluir lançamento"
                    aria-label="Excluir lançamento"
                  >
                    <Trash2 className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-500 text-sm font-medium">
                Nenhum registro encontrado para este período.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}