import PeriodControlView from "../components/ui/PeriodControlView";

export default function WeeklyFinance({ weeks, onAddTransaction, onDeleteTransaction, onUpdateTransaction }) {
  return <PeriodControlView 
    periods={weeks}
    onAddTransaction={onAddTransaction} 
    onDeleteTransaction={onDeleteTransaction}
    onUpdateTransaction={onUpdateTransaction}
    tipoRotulo="da semana" />;
}