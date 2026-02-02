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
      finalAmount: "Valor Final da Transação",
      closingDate: "Data de Fecho",
      // Commission role: Angariação do Investidor (CLIENT_ORIGINATOR)
      clientOriginator: "Angariação do Investidor",
      // NOT a commission role - just the user/client who invested
      investedPerson: "Pessoa Investidora",
      // Commission role: Acompanhamento do Investidor (DEAL_SUPPORT)
      followupPerson: "Acompanhamento do Investidor",
      commissionableAmount: "Valor Comissionável",
    },
    placeholders: {
      selectStatus: "Selecione o novo estado",
      finalAmount: "Insira o valor final da transação",
      clientOriginator: "Selecione o responsável pela angariação do investidor",
      investedPerson: "Selecione o cliente/investidor que comprou",
      followupPerson: "Selecione o responsável pelo acompanhamento do investidor",
      commissionableAmount: "Insira o valor comissionável",
    },
    helper: {
      values: "Atualize o valor final da transação ao fechar a oportunidade",
      concluded: "Marcar como concluído quando o negócio for finalizado",
      // Commission role explanation
      clientOriginator: "Função de comissão: pessoa responsável por trazer o investidor",
      // NOT a commission role - clarify this
      investedPerson: "Apenas registo: o cliente/investidor que investiu (sem comissão)",
      // Commission role explanation
      followupPerson: "Função de comissão: pessoa responsável pelo acompanhamento do investidor",
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
