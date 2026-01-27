export default {
  title: "Comissões",
  description: "Gerir taxas de comissão e visualizar projetos elegíveis para comissão",
  
  viewSelector: {
    myCommissions: "As Minhas Comissões",
    adminOverview: "Visão Geral Admin",
  },
  paymentStats: {
    totalReceived: "Total Recebido",
    totalReceivedDescription: "Total de comissões pagas até à data",
    totalYetToReceive: "Por Receber",
    totalYetToReceiveDescription: "Total de pagamentos de comissões pendentes",
  },
  summary: {
    title: "Resumo de Comissões",
    byRole: "Por Função",
    totalProjects: "Total de Projetos",
    pendingCommissions: "Pendentes",
    completedCommissions: "Concluídas",
  },

  roles: {
    ACCOUNT_MANAGER: "Acompanhamento do Cliente",
    CLIENT_ACQUISITION: "Angariação do Cliente",
    CLIENT_ORIGINATOR: "Angariação do Investidor",
    DEAL_SUPPORT: "Acompanhamento do Investidor",
  },

  projects: {
    title: "Projetos Elegíveis para Comissão",
    tabs: {
      pendingPayments: "Pagamentos Pendentes",
      pending: "Projetos Pendentes",
      concluded: "Projetos Concluídos",
    },
    emptyState: "Sem projetos elegíveis para comissão",
    emptyStateDescription: "Projetos onde tem funções de comissão aparecerão aqui",
    noConcludedProjects: "Sem projetos concluídos com comissões",
    noConcludedProjectsDescription: "Projetos concluídos com comissões configuradas aparecerão aqui",
    noPendingPayments: "Sem pagamentos pendentes",
    noPendingPaymentsDescription: "Todos os seus pagamentos de comissões foram recebidos",
    
    card: {
      role: "Função",
      project: "Projeto",
      finalValue: "Valor Final",
      commissionStatus: "Estado da Comissão",
      viewDetails: "Ver Detalhes",
    },

    status: {
      pending: "Pendente",
      concluded: "Concluído",
      notFinished: "Projeto não concluído",
      notSetUp: "Não Configurado",
      pendingPayment: "Pagamento Pendente",
    },

    details: {
      title: "Detalhes da Comissão",
      projectNotFinished: "Projeto não concluído — comissão pendente",
      finalAmount: "Valor Final",
      commissionableAmount: "Valor Comissionável",
      commissionPercentage: "Percentagem de Comissão",
      estimatedCommission: "Comissão Estimada",
      closedAt: "Fechado em",
      myCommission: "Minha Comissão",
      totalPaid: "Total Pago",
    },
  },

  admin: {
    overview: {
      title: "Visão Geral de Comissões dos Colaboradores",
      emptyState: "Nenhum membro da equipa encontrado",
      table: {
        employee: "Colaborador",
        totalProjects: "Total de Projetos",
        commissionRoles: "Funções de Comissão",        totalReceived: "Total Recebido",
        totalYetToReceive: "A Receber",        actions: "Ações",
        viewDetails: "Ver Detalhes",
      },
    },

    management: {
      title: "Gestão de Comissões",
      subtitle: "Definir percentagens de comissão para membros da equipa por função",
      table: {
        employee: "Colaborador",
        role: "Função",
        commissionPercentage: "Comissão %",
        actions: "Ações",
        save: "Guardar",
        saving: "A guardar...",
        cancel: "Cancelar",
        edit: "Editar",
      },
      validation: {
        invalidPercentage: "A percentagem deve estar entre 0 e 100",
        saveFailed: "Falha ao guardar percentagem de comissão",
        saveSuccess: "Percentagem de comissão atualizada com sucesso",
      },
      emptyState: "Nenhum membro da equipa disponível",
      emptyStateDescription: "Adicione membros da equipa para configurar comissões",
    },

    employeeDetails: {
      title: "Detalhes de Comissão do Colaborador",
      backToOverview: "Voltar à Visão Geral",
      commissionRates: "Taxas de Comissão",
      projectsByRole: "Projetos por Função",
      noCommissions: "Nenhuma taxa de comissão definida",
      noProjects: "Nenhum projeto atribuído",
    },
  },

  detail: {
    title: "Detalhes da Comissão",
    backToCommissions: "Voltar às Comissões",
    
    breakdown: {
      title: "Discriminação da Comissão",
      project: "Projeto",
      role: "Função",
      rolesAndCommissions: "Funções e Taxas de Comissão",
      commissionPercentage: "Taxa de Comissão",
      commissionee: "Comissionado",
      projectStatus: "Estado do Projeto",
    },

    totalValue: {
      title: "Valor Total da Comissão",
      finalAmount: "Valor Final do Projeto",
      commissionableAmount: "Valor Comissionável",
      commissionPercentage: "Percentagem de Comissão",
      totalCommission: "Comissão Total",
      notCalculated: "Não calculado",
      calculationPending: "Cálculo da comissão pendente até conclusão do projeto",
    },

    paymentSchedule: {
      title: "Plano de Pagamento",
      installment: "Parcela",
      paymentDate: "Data de Pagamento",
      paymentAmount: "Valor do Pagamento",
      status: "Estado",
      totalPaid: "Total Pago",
      totalRemaining: "Total Restante",
      totalScheduled: "Total Agendado",
      markAsPaid: "Marcar como Pago",
      markAsUnpaid: "Marcar como Não Pago",
      actualPaidDate: "Data Real de Pagamento",
      editPaidDate: "Editar Data de Pagamento",
      
      installmentNumber: {
        first: "Primeira Parcela",
        second: "Segunda Parcela",
        third: "Terceira Parcela",
      },

      statusValues: {
        pending: "Pendente",
        scheduled: "Agendado",
        paid: "Pago",
        notSet: "Não Definido",
      },

      actions: {
        editSchedule: "Editar Plano",
        saveSchedule: "Guardar Plano",
        cancel: "Cancelar",
        saving: "A guardar...",
        markingPaid: "A marcar como pago...",
        markingUnpaid: "A marcar como não pago...",
      },

      summary: {
        title: "Resumo de Pagamento",
        totalCommission: "Comissão Total",
        totalPaidAmount: "Total Pago",
        totalRemainingAmount: "Total Restante",
        percentagePaid: "Percentagem Paga",
      },

      toasts: {
        paymentMarkedPaid: "Pagamento marcado como pago",
        paymentMarkedUnpaid: "Pagamento marcado como não pago",
        updateFailed: "Falha ao atualizar estado do pagamento",
      },

      validation: {
        invalidAmount: "O valor deve ser superior a 0",
        dateRequired: "A data é obrigatória quando o valor está definido",
        amountRequired: "O valor é obrigatório quando a data está definida",
        saveFailed: "Falha ao guardar plano de pagamento",
        saveSuccess: "Plano de pagamento atualizado com sucesso",
      },

      emptyState: "Plano de pagamento não configurado",
      emptyStateDescription: "Os administradores podem configurar o plano de pagamento após conclusão do projeto",
    },
  },

  resolution: {
    title: "Resolver Comissões",
    backButton: "Voltar",
    alreadyResolved: "Já Resolvido",
    loadingDetails: "A carregar detalhes da comissão...",
    
    opportunityDetails: {
      title: "Detalhes da Oportunidade",
      status: "Estado",
      finalAmount: "Valor Final",
      commissionableAmount: "Valor Comissionável",
    },
    
    recipients: {
      title: "Destinatários de Comissão",
      description: "Comissões calculadas com base nas taxas atuais",
      emptyState: "Nenhum destinatário de comissão encontrado. Certifique-se de que os utilizadores têm taxas de comissão configuradas.",
      totalCommission: "Comissão Total",
      rate: "Taxa",
      amount: "Valor",
      grandTotal: "Total Geral",
      halvedTooltip: "Percentagem reduzida a metade devido a 2 Gestores de Conta nesta oportunidade",
    },
    
    paymentSchedule: {
      title: "Plano de Pagamento",
      description: "Definir datas e percentagens de pagamento. O mesmo plano aplicar-se-á a todos os {count} destinatário{plural}.",
      editDescription: "Editar o plano de pagamento para esta oportunidade",
      addPayment: "Adicionar Pagamento",
      installment: "Pagamento {number}",
      percentage: "Percentagem",
      paymentDate: "Data de Pagamento",
      total: "Total",
      mustEqual100: "(deve ser igual a 100%)",
      cancel: "Cancelar",
      save: "Resolver Comissões",
      update: "Atualizar Plano de Comissão",
      saving: "A guardar...",
      updating: "A atualizar...",
    },
    
    toasts: {
      resolveSuccess: "Comissões resolvidas com sucesso!",
      resolveFailed: "Falha ao resolver comissões",
    },
  },
  
  pendingResolution: {
    title: "Oportunidades Pendentes de Resolução de Comissão",
    description: "Oportunidades concluídas que precisam de planos de comissão configurados",
    emptyState: "Todas as oportunidades concluídas têm as suas comissões resolvidas",
    table: {
      name: "Nome",
      type: "Tipo",
      finalAmount: "Valor Final",
      commissionable: "Comissionável",
      actions: "Ações",
      setupButton: "Configurar Comissões",
    },
  },
  
  resolvedList: {
    title: "Comissões Resolvidas",
    titlePendingPayments: "Comissões com Pagamentos Pendentes",
    titleFullyPaid: "Comissões Totalmente Pagas",
    description: "Todas as oportunidades com planos de comissão resolvidos",
    descriptionPendingPayments: "Oportunidades com pagamentos de comissão pendentes",
    descriptionFullyPaid: "Oportunidades onde todos os pagamentos de comissão foram concluídos",
    emptyTitle: "Ainda sem comissões resolvidas",
    emptyMessage: "Resolva comissões para oportunidades concluídas para as ver aqui",
    emptyPendingPayments: "Sem pagamentos pendentes",
    emptyPendingPaymentsMessage: "Todas as comissões foram totalmente pagas",
    emptyFullyPaid: "Ainda sem comissões totalmente pagas",
    emptyFullyPaidMessage: "As comissões aparecerão aqui quando todos os pagamentos forem concluídos",
    table: {
      name: "Nome",
      type: "Tipo",
      recipients: "Destinatários",
      finalAmount: "Valor Final",
      commissionable: "Comissionável",
      totalPaid: "Total Pago",
      resolvedDate: "Resolvido",
      actions: "Ações",
      viewButton: "Ver",
    },
  },
  
  tabs: {
    pendingResolution: "Resolução Pendente",
    resolvedCommissions: "Comissões Resolvidas",
    teamMembers: "Membros da Equipa",
    commissionRates: "Taxas de Comissão",
  },
  
  loading: {
    commissionData: "A carregar dados de comissão...",
  },
  
  errorPage: {
    title: "Comissão Não Configurada",
    description: "O plano de comissão desta oportunidade ainda não foi configurado.",
    message: "Apenas os administradores podem configurar planos de comissão. Uma vez configurados, os detalhes da comissão estarão visíveis aqui.",
    backButton: "Voltar às Comissões",
  },
  
  opportunityTypes: {
    MNA: "F&A",
    REAL_ESTATE: "Imobiliário",
  },
} as const;
