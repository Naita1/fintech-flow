import React from "react";
import { fmtBRL } from "../../utils/format";
import TipoBadge from "./TipoBadge";
import CategoriaBadge from "./CategoriaBadge";

export default function FinancialTable({ transacoes }) {
  const sorted = [...transacoes].sort((a, b) => {
    const [da, ma] = a.data.split("/");
    const [db, mb] = b.data.split("/");
    return ma === mb ? da - db : ma - mb;
  });

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center transition-all duration-200">
        <p className="text-sm font-medium text-slate-500">
          Nenhuma movimentação registrada neste período ainda.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="hidden overflow-x-auto md:block scrolling-touch">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50 text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3.5 font-semibold">Data</th>
              <th className="px-5 py-3.5 font-semibold">Descrição</th>
              <th className="px-5 py-3.5 font-semibold">Categoria</th>
              <th className="px-5 py-3.5 font-semibold">Tipo</th>
              <th className="px-5 py-3.5 text-right font-semibold">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((t) => (
              <tr
                key={t.id}
                className="
                  transition-colors duration-150 ease-out
                  hover:bg-slate-50/80
                "
              >
                <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-slate-500">
                  {t.data}
                </td>
                <td className="px-5 py-3.5">
                  <p className="font-medium text-slate-700">{t.descricao}</p>
                  {t.observacao && (
                    <p className="mt-0.5 text-xs text-slate-400">{t.observacao}</p>
                  )}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5">
                  <CategoriaBadge categoria={t.categoria} />
                </td>
                <td className="whitespace-nowrap px-5 py-3.5">
                  <TipoBadge tipo={t.tipo} />
                </td>
                <td
                  className={`whitespace-nowrap px-5 py-3.5 text-right font-mono font-semibold tabular-nums ${
                    t.tipo === "entrada" ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {t.tipo === "entrada" ? "+ " : "- "}
                  {fmtBRL(t.valor)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-100 md:hidden">
        {sorted.map((t) => (
          <div
            key={t.id}
            className="
              flex items-start justify-between gap-3 p-4 
              transition-colors duration-150 ease-out
              motion-safe:active:bg-slate-50
            "
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-400">{t.data}</span>
              </div>
              <p className="mt-0.5 truncate font-medium text-slate-700">{t.descricao}</p>

              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <CategoriaBadge categoria={t.categoria} />
                <TipoBadge tipo={t.tipo} />
              </div>

              {t.observacao && (
                <p className="mt-1.5 text-xs text-slate-400 line-clamp-2">{t.observacao}</p>
              )}
            </div>

            <p
              className={`shrink-0 font-mono font-semibold tabular-nums text-sm sm:text-base ${
                t.tipo === "entrada" ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {t.tipo === "entrada" ? "+ " : "- "}
              {fmtBRL(t.valor)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}