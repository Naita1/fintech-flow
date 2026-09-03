import { useTransactionsContext } from "../context/TransactionsContext";
import PeriodControlView from "../components/ui/PeriodControlView";

export default function BiweeklyFinance() {
  const { quinzenas, addTransaction, deleteTransaction, updateTransaction } = useTransactionsContext();

  return (
    <main className="w-full motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-300 motion-reduce:animate-none">
      <PeriodControlView
        periods={quinzenas}
        onAddTransaction={addTransaction}
        onDeleteTransaction={deleteTransaction}
        onUpdateTransaction={updateTransaction}
        tipoRotulo="da quinzena"
        frequenciaPadrao="quinzenal"
      />
    </main>
  );
}