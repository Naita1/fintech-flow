import { z } from 'zod';

export const createTransactionSchema = z.object({
  body: z.object({
    description: z.string().min(1, 'A descrição é obrigatória').max(255),
    amount: z.number({ invalid_type_error: 'O valor deve ser um número' }).positive('O valor deve ser positivo'),
    type: z.string().min(1, 'O tipo é obrigatório'),
    category: z.string().min(1, 'A categoria é obrigatória'),
    frequency: z.string().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
    observation: z.string().nullable().optional(),
    tipo: z.string().optional(),
    frequencia: z.string().optional(),
    descricao: z.string().optional(),
    valor: z.number().optional()
  })
});

export const getTransactionsSchema = z.object({
  query: z.object({
    month: z.string().regex(/^(0?[1-9]|1[0-2])$/, 'Mês inválido').optional(),
    year: z.string().regex(/^\d{4}$/, 'Ano inválido').optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    category: z.string().optional(),
    page: z.string().regex(/^\d+$/, 'A página deve ser um número').optional(),
    limit: z.string().regex(/^\d+$/, 'O limite deve ser um número').optional()
  }).optional()
});