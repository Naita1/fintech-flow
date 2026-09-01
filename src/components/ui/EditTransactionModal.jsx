import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import TransactionForm from './TransactionForm';

export default function EditTransactionModal({ isOpen, onClose, transaction, onSave }) {
  if (!isOpen || !transaction) return null;

  const handleSave = (formData) => {
    const id = transaction.id || transaction._id;
    
    if (onSave) {
      onSave({ ...formData, id });
    }
    
    onClose();  
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                  Editar Movimentação
                </Dialog.Title>
                <div className="mt-4">
                  <TransactionForm 
                    onSubmit={handleSave}
                    initialData={transaction}
                    submitButtonText="Salvar Alterações"
                    onCancel={onClose}
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