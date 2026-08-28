import PeriodControlView from "../components/ui/PeriodControlView";

export default function WeeklyFinance({ weeks, onAddTransaction }) {
  return <PeriodControlView periods={weeks} onAddTransaction={onAddTransaction} tipoRotulo="da semana" />;
}