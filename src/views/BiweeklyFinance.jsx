import PeriodControlView from "../components/ui/PeriodControlView";

export default function BiweeklyFinance({ quinzenas, onAddTransaction }) {
  return (
    <main className="w-full motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-300 motion-reduce:animate-none">
      <PeriodControlView
        periods={quinzenas}
        onAddTransaction={onAddTransaction}
        tipoRotulo="da quinzena"
      />
    </main>
  );
}