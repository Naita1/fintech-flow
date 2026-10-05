import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import TransactionForm from './TransactionForm';

export default function AddTransactionModal({ isOpen, onClose, onSave }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    if (!isSaving) onClose();
  };

  const handleSave = async (formData) => {
    if (isSaving) return;
    setErrorMessage('');
    setIsSaving(true);

    try {
      if (typeof onSave !== 'function') {
        throw new Error('Não foi possível salvar a movimentação.');
      }
      await onSave(formData);
      onClose();
    } catch (error) {
      setErrorMessage(error.message || 'Falha ao salvar a movimentação.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-slate-100">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6 text-slate-800"
                >
                  Nova Movimentação
                </Dialog.Title>
                <div className="mt-4">
                  {errorMessage && (
                    <p role="alert" className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                      {errorMessage}
                    </p>
                  )}
                  <TransactionForm
                    onSubmit={handleSave}
                    submitButtonText={isSaving ? 'Salvando...' : 'Adicionar Movimentação'}
                    onCancel={handleClose}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}