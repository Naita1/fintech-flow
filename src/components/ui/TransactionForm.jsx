import { useState, useEffect } from 'react';
import { CATEGORIAS } from '../../constants/categories';

export default function TransactionForm({ onSubmit, initialData = null, onCancel, submitButtonText = "Salvar" }) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipo, setTipo] = useState('saida');
  const [categoria, setCategoria] = useState(CATEGORIAS[0]?.value || 'Outros');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setDescricao(initialData.descricao || initialData.description || '');
      setValor(initialData.valor || initialData.amount || '');
      setTipo(initialData.tipo || initialData.type || 'saida');
      setCategoria(initialData.categoria || initialData.category || 'Outros');
      setData((initialData.data || initialData.date || '').split('T')[0]);
    } else {
      setDescricao('');
      setValor('');
      setTipo('saida');
      setCategoria(CATEGORIAS[0]?.value || 'Outros');
      setData(new Date().toISOString().split('T')[0]);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!descricao || !valor || !data) return;

    onSubmit({
      descricao,
      valor: parseFloat(valor),
      tipo,
      categoria,
      data,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="descricao" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
          Descrição
        </label>
        <input
          type="text"
          id="descricao"
          placeholder="Ex: Compras do mês"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          required
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="valor" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Valor (R$)
          </label>
          <input
            type="number"
            id="valor"
            step="0.01"
            placeholder="0,00"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            required
          />
        </div>
        <div>
          <label htmlFor="data" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Data
          </label>
          <input
            type="date"
            id="data"
            value={data}
            onChange={(e) => setData(e.target.value)}
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
            onClick={() => setTipo('entrada')}
            className={`w-full rounded-xl py-2.5 px-4 text-sm font-semibold transition-all border ${
              tipo === 'entrada'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Entrada
          </button>
          <button
            type="button"
            onClick={() => setTipo('saida')}
            className={`w-full rounded-xl py-2.5 px-4 text-sm font-semibold transition-all border ${
              tipo === 'saida'
                ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Saída
          </button>
        </div>
      </div>
      <div>
        <label htmlFor="categoria" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
          Categoria
        </label>
        <select
          id="categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
        >
          {CATEGORIAS.map(cat => (
            <option key={cat.value || cat} value={cat.value || cat}>
              {cat.label || cat}
            </option>
          ))}
        </select>
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