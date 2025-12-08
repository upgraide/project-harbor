export default {
  title: "Fecho de Oportunidades",
  description: "Gerir o estado das oportunidades e fechar negócios",
  searchPlaceholder: "Pesquisar oportunidades por nome...",
  errorMessage: "Falha ao carregar oportunidades. Por favor, tente novamente.",
  emptyMessage: "Nenhuma oportunidade encontrada.",
  filters: {
    type: "Tipo",
    status: "Estado",
    all: "Todos",
    mna: "M&A",
    realEstate: "Imobiliário",
  },
  status: {
    ACTIVE: "Ativo",
    INACTIVE: "Inativo",
    CONCLUDED: "Concluído",
  },
  table: {
    name: "Nome",
    type: "Tipo",
    status: "Estado",
    updatedAt: "Última Atualização",
    actions: "Ações",
  },
  updateDialog: {
    title: "Atualizar Estado da Oportunidade",
    description: "Alterar o estado e atualizar valores finais desta oportunidade",
    labels: {
      status: "Novo Estado",
      finalAmount: "Valor Final",
      closingDate: "Data de Fecho",
    },
    placeholders: {
      selectStatus: "Selecione o novo estado",
      finalAmount: "Insira o valor final",
    },
    helper: {
      values: "Atualize o valor final ao fechar a oportunidade",
      concluded: "Marcar como concluído quando o negócio for finalizado",
    },
    update: "Atualizar Estado",
    updating: "Atualizando...",
    cancel: "Cancelar",
  },
  toast: {
    updateSuccess: "Estado da oportunidade atualizado com sucesso",
    updateError: "Falha ao atualizar estado da oportunidade",
    valuesUpdateSuccess: "Valores finais atualizados com sucesso",
    valuesUpdateError: "Falha ao atualizar valores finais",
  },
} as const;
