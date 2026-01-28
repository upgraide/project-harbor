export default {
  title: "Interesses de Investimento",
  description:
    "Visualize e gerencie os interesses dos investidores em oportunidades de M&A e Imobiliário",
  searchPlaceholder: "Pesquisar por nome da oportunidade...",
  errorMessage:
    "Falha ao carregar interesses de investimento. Por favor, tente novamente.",
  emptyTitle: "Nenhum Interesse de Investimento",
  emptyMessage:
    "Nenhum interesse de investimento encontrado correspondente aos seus filtros.",
  filters: {
    type: {
      placeholder: "Tipo",
      all: "Todos os Tipos",
      "m&a": "M&A",
      "real-estate": "Imobiliário",
    },
    status: {
      placeholder: "Estado",
      all: "Todos os Estados",
      pending: "Pendente",
      processed: "Processado",
    },
  },
  table: {
    clientName: "Nome do Cliente",
    project: "Projeto",
    interestType: "Tipo de Interesse",
    date: "Data",
    status: "Estado",
    actions: "Ações",
  },
  interestType: {
    "m&a": "M&A",
    "real-estate": "Imobiliário",
  },
  status: {
    pending: "Pendente",
    processed: "Processado",
  },
  actions: {
    viewDetails: "Ver Detalhes",
    markAsProcessed: "Marcar como Processado",
    sendDocuments: "Enviar Documentos",
  },
} as const;
