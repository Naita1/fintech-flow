import { useTransactionsContext } from "../context/TransactionsContext";
import PeriodControlView from "../components/ui/PeriodControlView";

export default function WeeklyFinance() {
  const { weeks, addTransaction, deleteTransaction, updateTransaction } = useTransactionsContext();

  return (
    <PeriodControlView
      periods={weeks}
      onAddTransaction={addTransaction}
      onDeleteTransaction={deleteTransaction}
      onUpdateTransaction={updateTransaction}
      tipoRotulo="da semana"
      frequenciaPadrao="semanal"
    />
  );
}