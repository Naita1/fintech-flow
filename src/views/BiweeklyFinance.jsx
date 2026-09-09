import { useTransactionsContext } from "../context/TransactionsContext";
import PeriodControlView from "../components/ui/PeriodControlView";

export default function BiweeklyFinance() {
  const { quinzenas, addTransaction, deleteTransaction, updateTransaction } = useTransactionsContext();

  return (
    <PeriodControlView
      periods={quinzenas}
      onAddTransaction={addTransaction}
      onDeleteTransaction={deleteTransaction}
      onUpdateTransaction={updateTransaction}
      tipoRotulo="da quinzena"
      frequenciaPadrao="quinzenal"
    />
  );
}