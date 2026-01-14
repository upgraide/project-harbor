export default {
  title: "Comissões",
  description: "Gerir taxas de comissão e visualizar projetos elegíveis para comissão",
  
  viewSelector: {
    myCommissions: "As Minhas Comissões",
    adminOverview: "Visão Geral Admin",
  },

  summary: {
    title: "Resumo de Comissões",
    byRole: "Por Função",
    totalProjects: "Total de Projetos",
    pendingCommissions: "Pendentes",
    completedCommissions: "Concluídas",
  },

  roles: {
    ACCOUNT_MANAGER: "Gestor de Conta",
    CLIENT_ACQUISITION: "Angariação de Cliente",
    DEAL_SUPPORT: "Apoio ao Negócio",
  },

  projects: {
    title: "Projetos Elegíveis para Comissão",
    tabs: {
      pending: "Projetos Pendentes",
      concluded: "Projetos Concluídos",
    },
    emptyState: "Sem projetos elegíveis para comissão",
    emptyStateDescription: "Os projetos onde tem funções de comissão aparecerão aqui",
    noConcludedProjects: "Sem projetos concluídos com comissões",
    noConcludedProjectsDescription: "Projetos concluídos com comissões configuradas aparecerão aqui",
    
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
    },

    details: {
      title: "Detalhes da Comissão",
      projectNotFinished: "Projeto não concluído — comissão pendente",
      finalAmount: "Valor Final",
      commissionableAmount: "Valor Comissionável",
      commissionPercentage: "Percentagem de Comissão",
      estimatedCommission: "Comissão Estimada",
      closedAt: "Fechado Em",
    },
  },

  admin: {
    overview: {
      title: "Visão Geral de Comissões dos Colaboradores",
      emptyState: "Nenhum membro da equipa encontrado",
      table: {
        employee: "Colaborador",
        totalProjects: "Total de Projetos",
        commissionRoles: "Funções de Comissão",
        actions: "Ações",
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
} as const;
