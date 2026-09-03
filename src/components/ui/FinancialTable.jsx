import { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { fmtBRL } from "../../utils/format";
import { formatDate } from "../../utils/formatDate";
import TipoBadge from "./TipoBadge";
import CategoriaBadge from "./CategoriaBadge";
import EditTransactionModal from "./EditTransactionModal";

export default function FinancialTable({ transacoes, onDeleteTransaction, onUpdateTransaction }) {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleDelete = (id) => {
    if (window.confirm("Deseja realmente apagar esta movimentação?")) {
      onDeleteTransaction(id);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setEditingTransaction(null);
  };

  const handleSaveTransaction = (transactionData) => {
    if (typeof onUpdateTransaction === "function") {
      onUpdateTransaction(transactionData);
    } else {
      console.warn("A função onUpdateTransaction não foi fornecida ao FinancialTable.");
    }
    handleCloseModal();
  };

  const checkIsIncome = (t) => {
    const rawType = String(t.type || t.tipo || "").toLowerCase();
    return rawType === "income" || rawType === "entrada" || rawType === "receita";
  };

  if (!transacoes || transacoes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center transition-all duration-200">
        <p className="text-sm font-medium text-slate-500">
          Nenhuma movimentação registrada neste período ainda.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto md:block scrolling-touch">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50 text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3.5 font-semibold">Data</th>
              <th className="px-5 py-3.5 font-semibold">Descrição</th>
              <th className="px-5 py-3.5 font-semibold">Categoria</th>
              <th className="px-5 py-3.5 font-semibold">Tipo</th>
              <th className="px-5 py-3.5 text-right font-semibold">Valor</th>
              <th className="px-5 py-3.5 text-center font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transacoes.map((t) => {
              const isIncome = checkIsIncome(t);
              return (
                <tr
                  key={t.id}
                  className="transition-colors duration-150 ease-out hover:bg-slate-50/80"
                >
                  <td className="whitespace-nowrap px-5 py-3.5 font-mono text-xs text-slate-500">
                    {formatDate(t.data || t.date)}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-slate-700">{t.descricao || t.description}</p>
                    {(t.observacao || t.observation) && (
                      <p className="mt-0.5 text-xs text-slate-400">{t.observacao || t.observation}</p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5">
                    <CategoriaBadge categoria={t.categoria || t.category} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5">
                    <TipoBadge tipo={isIncome ? "entrada" : "saida"} />
                  </td>
                  <td
                    className={`whitespace-nowrap px-5 py-3.5 text-right font-mono font-semibold tabular-nums ${
                      isIncome ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {isIncome ? "+ " : "- "}
                    {fmtBRL(t.valor || t.amount)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3.5 text-center">
                    <button
                      onClick={() => handleEdit(t)}
                      className="inline-flex items-center justify-center p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors mr-1"
                      title="Editar movimentação"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="inline-flex items-center justify-center p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Excluir movimentação"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="divide-y divide-slate-100 md:hidden">
        {transacoes.map((t) => {
          const isIncome = checkIsIncome(t);
          return (
            <div
              key={t.id}
              className="flex items-start justify-between gap-3 p-4 transition-colors duration-150 ease-out motion-safe:active:bg-slate-50"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-400">
                    {formatDate(t.data || t.date)}
                  </span>
                </div>
                <p className="mt-0.5 truncate font-medium text-slate-700">{t.descricao || t.description}</p>

                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                  <CategoriaBadge categoria={t.categoria || t.category} />
                  <TipoBadge tipo={isIncome ? "entrada" : "saida"} />
                </div>

                {(t.observacao || t.observation) && (
                  <p className="mt-1.5 text-xs text-slate-400 line-clamp-2">{t.observacao || t.observation}</p>
                )}
              </div>

              <div className="flex flex-col items-end gap-2">
                <p
                  className={`shrink-0 font-mono font-semibold tabular-nums text-sm sm:text-base ${
                    isIncome ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {isIncome ? "+ " : "- "}
                  {fmtBRL(t.valor || t.amount)}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(t)}
                    className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                    title="Editar movimentação"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Excluir movimentação"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {editingTransaction && (
        <EditTransactionModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          transaction={editingTransaction}
          onSave={handleSaveTransaction}
        />
      )}
    </>
  );
}