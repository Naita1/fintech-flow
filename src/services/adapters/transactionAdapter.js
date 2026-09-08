export function toFrontTransaction(apiTransaction) {
  if (!apiTransaction) return null;

  return {
    id: apiTransaction.id,
    description: apiTransaction.description,
    amount: Number(apiTransaction.amount),
    type: apiTransaction.type, 
    category: apiTransaction.category,
    frequency: apiTransaction.frequency || 'monthly',
    date: apiTransaction.date ? apiTransaction.date.split('T')[0] : '',
    observation: apiTransaction.observation || '',
    createdAt: apiTransaction.created_at,
  };
}

export function toApiTransaction(frontTransaction) {
  return {
    description: frontTransaction.description,
    amount: Number(frontTransaction.amount),
    type: frontTransaction.type,
    category: frontTransaction.category,
    frequency: frontTransaction.frequency,
    date: frontTransaction.date,
    observation: frontTransaction.observation || null,
  };
}