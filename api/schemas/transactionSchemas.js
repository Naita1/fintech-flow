import { z } from 'zod';

const VALID_TYPES = ['income', 'expense', 'receita', 'despesa', 'entrada', 'saida', 'saída'];
const VALID_FREQUENCIES = ['weekly', 'biweekly', 'monthly', 'semanal', 'quinzenal', 'mensal'];

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const idRegex = /^[1-9]\d*$/;

export const createTransactionSchema = z.object({
  body: z.object({
    description: z.string({ required_error: 'A descrição é obrigatória' }).trim().min(1, 'A descrição não pode ser vazia').max(255),
    amount: z.number({ invalid_type_error: 'O valor deve ser um número', required_error: 'O valor é obrigatório' }).positive('O valor deve ser positivo').max(999999999, 'Valor excede o limite permitido'),
    type: z.enum(VALID_TYPES, { errorMap: () => ({ message: 'Tipo deve ser receita/income ou despesa/expense' }) }),
    category: z.string({ required_error: 'A categoria é obrigatória' }).trim().min(1, 'A categoria é obrigatória').max(100),
    frequency: z.enum(VALID_FREQUENCIES, { errorMap: () => ({ message: 'Frequência inválida' }) }).optional(),
    date: z.string({ required_error: 'A data é obrigatória' }).regex(dateRegex, 'Data deve estar no formato YYYY-MM-DD'),
    observation: z.string().max(500, 'A observação deve ter no máximo 500 caracteres').nullable().optional(),
    tipo: z.string().optional(),
    frequencia: z.string().optional(),
    descricao: z.string().optional(),
    valor: z.number().optional()
  })
});

export const updateTransactionSchema = z.object({
  params: z.object({
    id: z.string().regex(idRegex, 'O ID da transação deve ser um número inteiro positivo')
  }),
  body: z.object({
    description: z.string().trim().min(1).max(255).optional(),
    amount: z.number().positive().max(999999999).optional(),
    type: z.enum(VALID_TYPES).optional(),
    category: z.string().trim().min(1).max(100).optional(),
    frequency: z.enum(VALID_FREQUENCIES).optional(),
    date: z.string().regex(dateRegex, 'Data deve estar no formato YYYY-MM-DD').optional(),
    observation: z.string().max(500).nullable().optional(),
    tipo: z.string().optional(),
    frequencia: z.string().optional(),
    descricao: z.string().optional(),
    valor: z.number().optional()
  })
});

export const transactionIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(idRegex, 'O ID da transação deve ser um número inteiro positivo')
  })
});

export const getTransactionsSchema = z.object({
  query: z.object({
    month: z.string().regex(/^(0?[1-9]|1[0-2])$/, 'Mês inválido').optional(),
    year: z.string().regex(/^\d{4}$/, 'Ano inválido').optional(),
    startDate: z.string().regex(dateRegex, 'startDate deve estar no formato YYYY-MM-DD').optional(),
    endDate: z.string().regex(dateRegex, 'endDate deve estar no formato YYYY-MM-DD').optional(),
    category: z.string().trim().max(100).optional(),
    page: z.string().regex(/^\d+$/, 'A página deve ser um número').optional(),
    limit: z.string().regex(/^([1-9]|[1-9][0-9]|100)$/, 'O limite deve estar entre 1 e 100').optional()
  }).optional()
});

export const getSummarySchema = z.object({
  query: z.object({
    month: z.string().regex(/^(0?[1-9]|1[0-2])$/, 'Mês inválido').optional(),
    year: z.string().regex(/^\d{4}$/, 'Ano inválido').optional(),
    startDate: z.string().regex(dateRegex, 'startDate deve estar no formato YYYY-MM-DD').optional(),
    endDate: z.string().regex(dateRegex, 'endDate deve estar no formato YYYY-MM-DD').optional()
  }).optional()
});