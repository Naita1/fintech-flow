export function toFrontTransaction(apiTransaction) {
  if (!apiTransaction) return null;

  const amount = Number(apiTransaction.amount);

  return {
    id: apiTransaction.id,
    description: apiTransaction.description,
    amount: isNaN(amount) ? 0 : amount,
    type: apiTransaction.type,
    category: apiTransaction.category,
    frequency: apiTransaction.frequency || 'monthly',
    date: apiTransaction.date ? apiTransaction.date.split('T')[0] : '',
    observation: apiTransaction.observation || '',
    createdAt: apiTransaction.created_at,
  };
}

export function toApiTransaction(frontTransaction) {
  const amount = Number(frontTransaction.amount);

  return {
    description: frontTransaction.description,
    amount: isNaN(amount) ? 0 : amount,
    type: frontTransaction.type,
    category: frontTransaction.category,
    frequency: frontTransaction.frequency,
    date: frontTransaction.date,
    observation: frontTransaction.observation || null,
  };
}