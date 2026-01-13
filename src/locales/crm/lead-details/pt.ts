export default {
  title: "Detalhes do Lead",
  loading: "Carregando...",
  notFound: "Lead não encontrado",
  backToList: "Voltar para Leads",
  
  sections: {
    basicInfo: {
      title: "Informações Básicas",
      name: "Nome",
      email: "Email",
      company: "Empresa",
      phone: "Telefone",
      website: "Website",
      status: "Estado",
      priority: "Prioridade",
      source: "Origem",
      department: "Departamento",
      leadScore: "Pontuação",
      createdAt: "Criado em",
      tags: "Tags",
    },
    
    assignment: {
      title: "Atribuição",
      responsible: "Responsável",
      mainContact: "Contacto Principal",
      unassigned: "Não atribuído",
    },
    
    financial: {
      title: "Informações Financeiras",
      ticketSize: "Ticket Size",
      targetReturn: "Retorno Alvo (TIR)",
      commissionRate: "Taxa de Comissão",
      commissionNotes: "Notas de Comissão",
    },
    
    strategy: {
      title: "Estratégia de Investimento",
      type: "Tipo de Investidor",
      strategy: "Estratégia",
      segment: "Segmento",
      locations: "Localizações Preferidas",
    },
    
    timeline: {
      title: "Cronologia",
      lastContact: "Último Contacto",
      nextFollowUp: "Próximo Follow-up",
      converted: "Convertido em",
      lost: "Perdido em",
      lostReason: "Motivo da Perda",
      noDate: "Não agendado",
    },
    
    notes: {
      title: "Notas",
      addNote: "Adicionar Nota",
      noNotes: "Ainda sem notas",
      by: "por",
      lastNotes: "Últimas Notas",
    },
    
    activities: {
      title: "Cronologia de Atividades",
      noActivities: "Ainda sem atividades",
      types: {
        NOTE: "Nota",
        ASSIGNMENT_CHANGE: "Mudança de Atribuição",
        STATUS_CHANGE: "Mudança de Estado",
        FOLLOW_UP_SCHEDULED: "Follow-up Agendado",
        FOLLOW_UP_COMPLETED: "Follow-up Concluído",
        MEETING: "Reunião",
        EMAIL: "Email",
        CALL: "Chamada",
        CONVERTED: "Convertido",
        LOST: "Perdido",
      },
    },
    
    contact: {
      title: "Detalhes de Contacto",
      representative: "Nome do Representante",
      physicalAddress: "Morada Física",
      acceptMarketing: "Aceita Marketing",
      yes: "Sim",
      no: "Não",
      otherFacts: "Outros Factos",
    },
  },
  
  actions: {
    assign: "Atribuir Lead",
    addNote: "Adicionar Nota",
    scheduleFollowUp: "Agendar Follow-up",
    updateStatus: "Atualizar Estado",
    edit: "Editar Lead",
  },
} as const;
