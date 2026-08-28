import { useState } from "react";
import { X, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { CATEGORIAS_ENTRADA, CATEGORIAS_SAIDA } from "../../constants/categories";

export default function TransactionForm({ onClose, onSubmit }) {
  const [tipo, setTipo] = useState("entrada");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS_ENTRADA[0]);
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [observacao, setObservacao] = useState("");

  const categorias = tipo === "entrada" ? CATEGORIAS_ENTRADA : CATEGORIAS_SAIDA;

  const handleTipo = (novoTipo) => {
    setTipo(novoTipo);
    setCategoria(novoTipo === "entrada" ? CATEGORIAS_ENTRADA[0] : CATEGORIAS_SAIDA[0]);
  };

  const podeSalvar = descricao.trim() && valor && Number(valor) > 0 && data;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!podeSalvar) return;
    onSubmit({
      tipo,
      descricao: descricao.trim(),
      categoria,
      valor: Number(valor),
      data,
      observacao: observacao.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-[2px] transition-opacity duration-200 sm:items-center sm:p-4">
      <div className="max-h-[90vh] sm:max-h-[92vh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl scrolling-touch sm:max-w-lg sm:rounded-2xl motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-6 sm:motion-safe:zoom-in-95 motion-reduce:transition-none">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur-md">
          <h2 className="text-base font-bold text-slate-800">Nova movimentação</h2>
          <button
            onClick={onClose}
            type="button"
            className="
              inline-flex min-h-9 min-w-9 items-center justify-center rounded-full text-slate-400 
              transition-colors duration-150 ease-out 
              hover:bg-slate-100 hover:text-slate-600 
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-800
              motion-safe:active:scale-95
            "
            aria-label="Fechar modal"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5 sm:px-6">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Tipo
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleTipo("entrada")}
                className={`
                  flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold select-none
                  transition-all duration-150 ease-out
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
                  motion-safe:active:scale-[0.98]
                  motion-reduce:transition-none
                  ${
                    tipo === "entrada"
                      ? "border-emerald-500 bg-emerald-50/80 text-emerald-700 shadow-sm"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }
                `}
              >
                <ArrowUpCircle size={18} className="shrink-0" />
                <span>Entrada</span>
              </button>

              <button
                type="button"
                onClick={() => handleTipo("saida")}
                className={`
                  flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold select-none
                  transition-all duration-150 ease-out
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500
                  motion-safe:active:scale-[0.98]
                  motion-reduce:transition-none
                  ${
                    tipo === "saida"
                      ? "border-rose-500 bg-rose-50/80 text-rose-700 shadow-sm"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }
                `}
              >
                <ArrowDownCircle size={18} className="shrink-0" />
                <span>Saída</span>
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Descrição
            </label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex.: Venda de produtos, pagamento de fornecedor..."
              className="
                w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-[16px] text-slate-700 outline-none sm:text-sm
                transition-all duration-150 ease-out
                placeholder:text-slate-400
                focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10
              "
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Categoria
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="
                  w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-[16px] text-slate-700 outline-none sm:text-sm bg-white
                  transition-all duration-150 ease-out
                  focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10
                "
              >
                {categorias.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Valor (R$)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
                className="
                  w-full rounded-xl border border-slate-200 px-3.5 py-2.5 font-mono text-[16px] text-slate-700 outline-none sm:text-sm
                  transition-all duration-150 ease-out
                  placeholder:text-slate-400
                  focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10
                "
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Data
            </label>
            <input
              type="date"
              onChange={(e) => {
                if (!e.target.value) return setData("");
                const [y, m, d] = e.target.value.split("-");
                setData(`${d}/${m}/${y}`);
              }}
              className="
                w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-[16px] text-slate-700 outline-none sm:text-sm bg-white
                transition-all duration-150 ease-out
                focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10
              "
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Observação <span className="normal-case text-slate-300">(opcional)</span>
            </label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={2}
              placeholder="Alguma informação adicional sobre essa movimentação..."
              className="
                w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-[16px] text-slate-700 outline-none sm:text-sm
                transition-all duration-150 ease-out
                placeholder:text-slate-400
                focus:border-slate-800 focus:ring-2 focus:ring-slate-800/10
              "
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="
                flex-1 min-h-11 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 select-none
                transition-all duration-150 ease-out
                hover:bg-slate-50 hover:border-slate-300
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-800
                motion-safe:active:scale-[0.98]
                motion-reduce:transition-none
              "
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!podeSalvar}
              className="
                flex-1 min-h-11 rounded-xl bg-slate-800 py-2.5 text-sm font-semibold text-white shadow-sm select-none
                transition-all duration-150 ease-out
                hover:bg-slate-900 hover:shadow
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 focus-visible:ring-offset-2
                motion-safe:active:scale-[0.98]
                disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-slate-800 disabled:hover:shadow-none disabled:active:scale-100
                motion-reduce:transition-none
              "
            >
              Salvar movimentação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}