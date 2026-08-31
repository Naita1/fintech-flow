import PeriodControlView from "../components/ui/PeriodControlView";

export default function WeeklyFinance({ weeks, onAddTransaction, onDeleteTransaction }) {
  return <PeriodControlView 
    periods={weeks}
    onAddTransaction={onAddTransaction} 
    onDeleteTransaction={onDeleteTransaction}
    tipoRotulo="da semana" />;
}