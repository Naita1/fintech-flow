let idCounter = 1000;
const nextId = () => `tx-${idCounter++}`;

export const tx = (tipo, descricao, categoria, valor, data, observacao = "") => ({
  id: nextId(),
  tipo,
  descricao,
  categoria,
  valor,
  data,
  observacao,
});

export const initialWeeks = [
  {
    id: "sem-1",
    label: "Semana 1",
    periodo: "03/08 – 09/08",
    transacoes: [
      tx("entrada", "Venda de produtos - loja física", "Vendas", 8500, "03/08/2026"),
      tx("entrada", "Contrato de consultoria - Cliente Alfa", "Consultoria", 3200, "05/08/2026"),
      tx("entrada", "Venda pelo site", "Vendas", 1450, "07/08/2026"),
      tx("saida", "Pagamento fornecedor de insumos", "Fornecedores", 4200, "04/08/2026"),
      tx("saida", "Conta de energia elétrica", "Utilidades", 680, "06/08/2026"),
      tx("saida", "Campanha de anúncios online", "Marketing", 950, "08/08/2026"),
      tx("saida", "Manutenção de equipamentos", "Manutenção", 420, "09/08/2026"),
    ],
  },
  {
    id: "sem-2",
    label: "Semana 2",
    periodo: "10/08 – 16/08",
    transacoes: [
      tx("entrada", "Venda de produtos - loja física", "Vendas", 9200, "11/08/2026"),
      tx("entrada", "Serviços prestados - Cliente Beta", "Serviços", 2100, "13/08/2026"),
      tx("saida", "Folha de pagamento da equipe", "Salários", 12000, "15/08/2026", "Referente à quinzena"),
      tx("saida", "Pagamento fornecedor de embalagens", "Fornecedores", 3100, "12/08/2026"),
      tx("saida", "Aluguel do escritório", "Aluguel", 2800, "10/08/2026"),
    ],
  },
  {
    id: "sem-3",
    label: "Semana 3",
    periodo: "17/08 – 23/08",
    transacoes: [
      tx("entrada", "Venda de produtos - loja física", "Vendas", 10400, "18/08/2026"),
      tx("entrada", "Contrato de consultoria - Cliente Gama", "Consultoria", 4300, "20/08/2026"),
      tx("entrada", "Venda pelo site", "Vendas", 2100, "22/08/2026"),
      tx("saida", "Pagamento fornecedor de insumos", "Fornecedores", 3800, "19/08/2026"),
      tx("saida", "Campanha de anúncios online", "Marketing", 1200, "21/08/2026"),
      tx("saida", "Guia de impostos municipais", "Impostos", 2600, "23/08/2026"),
    ],
  },
  {
    id: "sem-4",
    label: "Semana 4",
    periodo: "24/08 – 30/08",
    transacoes: [
      tx("entrada", "Venda de produtos - loja física", "Vendas", 5200, "24/08/2026"),
      tx("entrada", "Serviços prestados - Cliente Delta", "Serviços", 1800, "25/08/2026"),
      tx("saida", "Conta de água e energia", "Utilidades", 540, "24/08/2026"),
      tx("saida", "Manutenção de equipamentos", "Manutenção", 300, "25/08/2026"),
    ],
  },
];

export const initialQuinzenas = [
  {
    id: "q-1",
    label: "1ª Quinzena",
    periodo: "01/08 – 15/08",
    transacoes: [
      tx("entrada", "Venda de produtos - loja física", "Vendas", 17700, "08/08/2026"),
      tx("entrada", "Contrato de consultoria - Cliente Alfa", "Consultoria", 3200, "05/08/2026"),
      tx("entrada", "Serviços prestados - Cliente Beta", "Serviços", 2100, "13/08/2026"),
      tx("entrada", "Venda pelo site", "Vendas", 1450, "07/08/2026"),
      tx("saida", "Folha de pagamento da equipe", "Salários", 12000, "15/08/2026"),
      tx("saida", "Pagamento fornecedores", "Fornecedores", 7300, "12/08/2026"),
      tx("saida", "Aluguel do escritório", "Aluguel", 2800, "10/08/2026"),
      tx("saida", "Conta de energia elétrica", "Utilidades", 680, "06/08/2026"),
      tx("saida", "Campanha de anúncios online", "Marketing", 950, "08/08/2026"),
      tx("saida", "Manutenção de equipamentos", "Manutenção", 420, "09/08/2026"),
    ],
  },
  {
    id: "q-2",
    label: "2ª Quinzena",
    periodo: "16/08 – 31/08",
    transacoes: [
      tx("entrada", "Venda de produtos - loja física", "Vendas", 15600, "18/08/2026"),
      tx("entrada", "Contrato de consultoria - Cliente Gama", "Consultoria", 4300, "20/08/2026"),
      tx("entrada", "Serviços prestados - Cliente Delta", "Serviços", 1800, "25/08/2026"),
      tx("entrada", "Venda pelo site", "Vendas", 2100, "22/08/2026"),
      tx("saida", "Pagamento fornecedores", "Fornecedores", 3800, "19/08/2026"),
      tx("saida", "Campanha de anúncios online", "Marketing", 1200, "21/08/2026"),
      tx("saida", "Guia de impostos municipais", "Impostos", 2600, "23/08/2026"),
      tx("saida", "Conta de água e energia", "Utilidades", 540, "24/08/2026"),
      tx("saida", "Manutenção de equipamentos", "Manutenção", 300, "25/08/2026"),
    ],
  },
];