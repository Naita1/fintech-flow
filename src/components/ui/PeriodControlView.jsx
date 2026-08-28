import { useState } from "react";
import { Plus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import PeriodSelector from "./PeriodSelector";
import SummaryCard from "./SummaryCard";
import ProfitLossIndicator from "./ProfitLossIndicator";
import FinancialTable from "./FinancialTable";
import TransactionForm from "./TransactionForm";
import { totals } from "../../utils/calculations";
import { fmtBRL } from "../../utils/format";

export default function PeriodControlView({ periods = [], onAddTransaction, tipoRotulo }) {
  const [selectedId, setSelectedId] = useState(() => periods[0]?.id || "");
  const [showForm, setShowForm] = useState(false);

  const period = periods.find((p) => p.id === selectedId) || periods[0];
  const transacoes = period?.transacoes || [];
  const { entradas, saidas, saldo } = totals(transacoes);

  return (
    <div className="space-y-6">
      <PeriodSelector periods={periods} selectedId={selectedId || periods[0]?.id} onChange={setSelectedId} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold text-slate-800">{period?.label || "Período"}</h2>
          {period?.periodo && <p className="truncate text-xs sm:text-sm text-slate-400">{period.periodo}</p>}
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="
            inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm sm:w-auto
            transition-all duration-150 ease-out
            hover:bg-slate-900 hover:shadow
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2
            motion-safe:active:scale-[0.98]
            motion-reduce:transition-none
          "
        >
          <Plus size={18} className="shrink-0" />
          <span>Nova movimentação</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
        <SummaryCard label="Entradas" value={fmtBRL(entradas)} icon={ArrowUpRight} tone="entrada" />
        <SummaryCard label="Saídas" value={fmtBRL(saidas)} icon={ArrowDownRight} tone="saida" />
        <div className="col-span-2 sm:col-span-1">
          <ProfitLossIndicator saldo={saldo} />
        </div>
      </div>

      <div className="space-y-2.5">
        <h3 className="text-sm font-semibold text-slate-600">Movimentações de {tipoRotulo}</h3>
        <FinancialTable transacoes={transacoes} />
      </div>

      {showForm && (
        <TransactionForm
          onClose={() => setShowForm(false)}
          onSubmit={(novaTx) => {
            onAddTransaction(period?.id || selectedId, novaTx);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}