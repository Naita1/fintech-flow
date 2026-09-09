import { useState, useEffect } from 'react';
import { CATEGORIAS } from '../../constants/categories';

export default function TransactionForm({ onSubmit, initialData = null, onCancel, submitButtonText = "Salvar" }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(CATEGORIAS[0]?.value || 'Outros');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [observation, setObservation] = useState('');

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setDescription(initialData.description || '');
      setAmount(initialData.amount || '');
      setType(initialData.type || 'expense');
      setCategory(initialData.category || 'Outros');
      setDate((initialData.date || '').split('T')[0]);
      setObservation(initialData.observation || '');
    } else {
      setDescription('');
      setAmount('');
      setType('expense');
      setCategory(CATEGORIAS[0]?.value || 'Outros');
      setDate(new Date().toISOString().split('T')[0]);
      setObservation('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount || !date) return;

    onSubmit({
      description,
      amount: parseFloat(amount),
      type,
      category,
      date,
      observation,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
          Descrição
        </label>
        <input
          type="text"
          id="description"
          placeholder="Ex: Compras do mês"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          required
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="amount" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Valor (R$)
          </label>
          <input
            type="number"
            id="amount"
            step="0.01"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            required
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Data
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
          Tipo
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setType('income')}
            className={`w-full rounded-xl py-2.5 px-4 text-sm font-semibold transition-all border ${
              type === 'income'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Entrada
          </button>
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`w-full rounded-xl py-2.5 px-4 text-sm font-semibold transition-all border ${
              type === 'expense'
                ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Saída
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="category" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
          Categoria
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
        >
          {CATEGORIAS.map(cat => (
            <option key={cat.value || cat} value={cat.value || cat}>
              {cat.label || cat}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="observation" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
          Observação (Opcional)
        </label>
        <textarea
          id="observation"
          placeholder="Ex: Pago no cartão de crédito"
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
      </div>
      <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  );
}