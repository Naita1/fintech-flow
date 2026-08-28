import React, { useState } from "react";
import { Building2, ChevronDown } from "lucide-react";
import CategoriaBadge from "../components/ui/CategoriaBadge";
import { totals } from "../utils/calculations";
import { fmtBRL } from "../utils/format";

export default function FinancialReport({ weeks, quinzenas }) {
  const allPeriods = [...weeks, ...quinzenas];
  const [selectedId, setSelectedId] = useState(weeks[0].id);
  const period = allPeriods.find((p) => p.id === selectedId);

  const sorted = [...period.transacoes].sort((a, b) => {
    const [da, ma] = a.data.split("/");
    const [db, mb] = b.data.split("/");
    return ma === mb ? da - db : ma - mb;
  });

  let saldoCorrido = 0;
  const linhas = sorted.map((t) => {
    saldoCorrido += t.tipo === "entrada" ? t.valor : -t.valor;
    return { ...t, saldoCorrido };
  });

  const { entradas, saidas, saldo } = totals(period.transacoes);

  return (
    <div className="space-y-5 motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-300 motion-reduce:animate-none">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-slate-800 tracking-tight truncate">Relatório financeiro</h2>
          <p className="text-sm text-slate-400 truncate">Visualização em formato de planilha</p>
        </div>
        
        <div className="relative shrink-0">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full min-h-[44px] appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3.5 pr-10 text-[16px] sm:text-sm font-medium text-slate-700 outline-none select-none
              transition-all duration-150 ease-out
              hover:border-slate-300 hover:bg-slate-50/50
              focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 sm:w-64"
          >
            <optgroup label="Semanal">
              {weeks.map((w) => (
                <option key={w.id} value={w.id}>{w.label} ({w.periodo})</option>
              ))}
            </optgroup>
            <optgroup label="Quinzenal">
              {quinzenas.map((q) => (
                <option key={q.id} value={q.id}>{q.label} ({q.periodo})</option>
              ))}
            </optgroup>
          </select>
          <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        
        <div className="flex flex-col gap-2 border-b border-dashed border-slate-200 p-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 bg-slate-100 rounded-xl shrink-0">
              <Building2 size={20} className="text-slate-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">Relatório · {period.label}</p>
              <p className="text-xs font-medium text-slate-400 truncate">Período: {period.periodo}</p>
            </div>
          </div>
          <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold shrink-0 transition-colors duration-200 ${
            saldo >= 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : "bg-rose-50 text-rose-700 border border-rose-200/60"
          }`}>
            {saldo >= 0 ? "Lucro" : "Prejuízo"} · {fmtBRL(Math.abs(saldo))}
          </span>
        </div>

        <div className="hidden md:block overflow-x-auto scrolling-touch">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/60 text-xs uppercase tracking-wider text-slate-400 select-none">
                <th className="px-4 py-3.5 font-semibold">Data</th>
                <th className="px-4 py-3.5 font-semibold">Descrição</th>
                <th className="px-4 py-3.5 font-semibold">Categoria</th>
                <th className="px-4 py-3.5 text-right font-semibold">Entrada</th>
                <th className="px-4 py-3.5 text-right font-semibold">Saída</th>
                <th className="px-4 py-3.5 text-right font-semibold">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {linhas.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors duration-150 ease-out">
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-500">{t.data}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{t.descricao}</td>
                  <td className="px-4 py-3 whitespace-nowrap"><CategoriaBadge categoria={t.categoria} /></td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-mono tabular-nums text-emerald-600 font-semibold">
                    {t.tipo === "entrada" ? fmtBRL(t.valor) : "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-mono tabular-nums text-rose-600 font-semibold">
                    {t.tipo === "saida" ? fmtBRL(t.valor) : "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-mono font-bold tabular-nums text-slate-700">
                    {fmtBRL(t.saldoCorrido)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50/90 font-bold border-t border-slate-200">
                <td className="px-4 py-3.5 text-xs uppercase tracking-wider text-slate-500" colSpan={3}>Totais do período</td>
                <td className="whitespace-nowrap px-4 py-3.5 text-right font-mono tabular-nums text-emerald-700">{fmtBRL(entradas)}</td>
                <td className="whitespace-nowrap px-4 py-3.5 text-right font-mono tabular-nums text-rose-700">{fmtBRL(saidas)}</td>
                <td className={`whitespace-nowrap px-4 py-3.5 text-right font-mono tabular-nums ${saldo >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                  {fmtBRL(saldo)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="divide-y divide-slate-100 md:hidden">
          {linhas.map((t) => (
            <div key={t.id} className="p-4 space-y-2.5 transition-colors duration-150 motion-safe:active:bg-slate-50">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-slate-400 font-medium">{t.data}</span>
                <CategoriaBadge categoria={t.categoria} />
              </div>
              
              <p className="font-semibold text-sm text-slate-800 leading-tight">{t.descricao}</p>
              
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100/80">
                <div className="space-y-0.5">
                  <span className="text-slate-400 block text-[11px]">Movimentação</span>
                  <span className={`font-mono font-bold tabular-nums ${t.tipo === "entrada" ? "text-emerald-600" : "text-rose-600"}`}>
                    {t.tipo === "entrada" ? `+ ${fmtBRL(t.valor)}` : `- ${fmtBRL(t.valor)}`}
                  </span>
                </div>
                <div className="text-right space-y-0.5">
                  <span className="text-slate-400 block text-[11px]">Saldo Corrido</span>
                  <span className="font-mono font-bold text-slate-700 tabular-nums">
                    {fmtBRL(t.saldoCorrido)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div className="p-4 bg-slate-50 space-y-2 border-t border-slate-200">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Totais do período</p>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 font-medium">Entradas:</span>
              <span className="font-mono font-bold text-emerald-700 tabular-nums">{fmtBRL(entradas)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 font-medium">Saídas:</span>
              <span className="font-mono font-bold text-rose-700 tabular-nums">{fmtBRL(saidas)}</span>
            </div>
            <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200/80">
              <span className="font-bold text-slate-800">Saldo Final:</span>
              <span className={`font-mono font-bold tabular-nums ${saldo >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                {fmtBRL(saldo)}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}