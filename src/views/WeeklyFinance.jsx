import { useTransactionsContext } from "../context/TransactionsContext";
import PeriodControlView from "../components/ui/PeriodControlView";

export default function WeeklyFinance() {
  const { weeks, addTransaction, deleteTransaction, updateTransaction } = useTransactionsContext();

  return (
    <div className="motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-300 motion-reduce:animate-none">
      <PeriodControlView
        periods={weeks}
        onAddTransaction={addTransaction}
        onDeleteTransaction={deleteTransaction}
        onUpdateTransaction={updateTransaction}
        tipoRotulo="da semana"
        frequenciaPadrao="semanal"
      />
    </div>
  );
}