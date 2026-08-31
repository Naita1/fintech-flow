import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import PeriodSelector from "./PeriodSelector";
import SummaryCard from "./SummaryCard";
import ProfitLossIndicator from "./ProfitLossIndicator";
import FinancialTable from "./FinancialTable";
import TransactionForm from "./TransactionForm";
import { totals } from "../../utils/calculations";
import { fmtBRL } from "../../utils/format";

export default function PeriodControlView({
  periods = [],
  onAddTransaction,
  onDeleteTransaction,
  tipoRotulo = "do período",
}) {
  const [selectedPeriodId, setSelectedPeriodId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (periods.length > 0 && !selectedPeriodId) {
      setSelectedPeriodId(periods[0].id);
    }
  }, [periods, selectedPeriodId]);

  const activePeriod =
    periods.find((p) => p.id === selectedPeriodId) || periods[0] || {};
  const transacoes = activePeriod?.transacoes || [];
  const { entradas, saidas, saldo } = totals(transacoes);

  return (
    <div className="space-y-6">
      <PeriodSelector
        periods={periods}
        selectedId={selectedPeriodId || periods[0]?.id}
        onChange={setSelectedPeriodId}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
        <SummaryCard label="Entradas" value={fmtBRL(entradas)} icon={ArrowUpRight} tone="entrada" />
        <SummaryCard label="Saídas" value={fmtBRL(saidas)} icon={ArrowDownRight} tone="saida" />
        <div className="col-span-2 sm:col-span-1">
          <ProfitLossIndicator saldo={saldo} />
        </div>
      </div>

      <div className="space-y-2.5">
        <h3 className="text-sm font-semibold text-slate-600">Movimentações {tipoRotulo}</h3>
        <FinancialTable
          transacoes={transacoes}
          onDeleteTransaction={onDeleteTransaction}
        />
      </div>

      {showForm && (
        <TransactionForm
          onClose={() => setShowForm(false)}
          onSubmit={(novaTx) => {
            onAddTransaction(activePeriod?.id || selectedPeriodId, novaTx);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}