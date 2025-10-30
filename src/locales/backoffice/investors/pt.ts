export default {
  title: "Clientes / Investidores",
  addNewInvestor: "Adicionar Novo Investidor",
  searchPlaceholder: "Pesquisar por nome ou email...",
  errorMessage: "Falha ao carregar investidores. Por favor, tente novamente.",
  emptyTitle: "Sem Investidores",
  emptyMessage: "Nenhum investidor encontrado correspondendo aos seus filtros.",
  filters: {
    investorType: {
      placeholder: "Tipo de Investidor",
      all: "Todos os Tipos",
      "<€10M": "<€10M",
      "€10M-€100M": "€10M-€100M",
      ">€100M": ">€100M",
    },
    interestSegment: {
      placeholder: "Segmento de Interesse",
      all: "Todos os Segmentos",
      CRE: "CRE",
      "M&A": "M&A",
    },
    industry: {
      placeholder: "Indústria/Subcategoria",
      all: "Todas as Indústrias",
    },
  },
  table: {
    name: "Nome",
    email: "Email",
    investorType: "Tipo de Investidor",
    interestSegments: "Segmentos de Interesse",
    interestSubcategories: "Subcategorias de Interesse",
    preferredLocation: "Localização Preferida",
  },
} as const;
