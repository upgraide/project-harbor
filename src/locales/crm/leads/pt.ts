export default {
  title: "Gestão de Leads",
  description: "Gerir e acompanhar todos os potenciais investidores e clientes",
  searchPlaceholder: "Pesquisar por nome, email ou empresa...",
  errorMessage: "Falha ao carregar leads. Por favor, tente novamente.",
  emptyMessage: "Nenhum lead encontrado.",
  
  filters: {
    title: "Filtros",
    leadSource: "Origem do Lead",
    assignedTo: "Atribuído A",
    department: "Departamento",
    lastContactDate: "Data do Último Contacto",
    status: "Estado",
    priority: "Prioridade",
    all: "Todos",
    reset: "Limpar Filtros",
    apply: "Aplicar Filtros",
  },

  sorting: {
    title: "Ordenar Por",
    lastContactDate: "Data do Último Contacto",
    createdAt: "Data de Criação",
    name: "Nome",
    minTicketSize: "Ticket Size (Mín)",
    maxTicketSize: "Ticket Size (Máx)",
  },

  leadSource: {
    WEBSITE: "Website",
    REFERRAL: "Referência",
    COLD_OUTREACH: "Prospeção Fria",
    NETWORKING_EVENT: "Evento de Networking",
    LINKEDIN: "LinkedIn",
    EMAIL_CAMPAIGN: "Campanha de Email",
    PARTNER: "Parceiro",
    EXISTING_CLIENT: "Cliente Existente",
    ACCESS_REQUEST: "Pedido de Acesso",
    OTHER: "Outro",
  },

  leadStatus: {
    NEW: "Novo",
    CONTACTED: "Contactado",
    QUALIFIED: "Qualificado",
    MEETING_SCHEDULED: "Reunião Agendada",
    PROPOSAL_SENT: "Proposta Enviada",
    NEGOTIATION: "Negociação",
    CONVERTED: "Convertido",
    LOST: "Perdido",
    ON_HOLD: "Em Espera",
    NURTURE: "Nutrir",
  },

  leadPriority: {
    LOW: "Baixa",
    MEDIUM: "Média",
    HIGH: "Alta",
    URGENT: "Urgente",
  },

  department: {
    MNA: "M&A",
    CRE: "CRE",
    MNA_AND_CRE: "M&A & CRE",
  },

  table: {
    name: "Nome",
    company: "Empresa",
    email: "Email",
    lastContactDate: "Último Contacto",
    status: "Estado",
    priority: "Prioridade",
    leadSource: "Origem",
    assignedTo: "Atribuído A",
    department: "Departamento",
    ticketSize: "Ticket Size",
    actions: "Ações",
    noData: "Nenhum lead disponível",
  },

  quickActions: {
    title: "Ações Rápidas",
    assign: "Atribuir Lead",
    addNote: "Adicionar Nota",
    scheduleFollowUp: "Agendar Follow-up",
    viewDetails: "Ver Detalhes",
  },

  assignDialog: {
    title: "Atribuir Lead",
    description: "Atribuir este lead a um membro da equipa",
    labels: {
      assignTo: "Atribuir A",
      department: "Departamento",
    },
    placeholders: {
      selectUser: "Selecionar membro da equipa",
      selectDepartment: "Selecionar departamento",
    },
    assign: "Atribuir",
    assigning: "A atribuir...",
    cancel: "Cancelar",
    success: "Lead atribuído com sucesso",
    error: "Falha ao atribuir lead",
  },

  noteDialog: {
    title: "Adicionar Nota",
    description: "Adicionar uma nota a este lead",
    labels: {
      note: "Nota",
    },
    placeholders: {
      note: "Escreva a sua nota aqui...",
    },
    add: "Adicionar Nota",
    adding: "A adicionar...",
    cancel: "Cancelar",
    success: "Nota adicionada com sucesso",
    error: "Falha ao adicionar nota",
  },

  followUpDialog: {
    title: "Agendar Follow-up",
    description: "Agendar um follow-up para este lead",
    labels: {
      date: "Data do Follow-up",
      time: "Hora",
      note: "Nota (opcional)",
    },
    placeholders: {
      date: "Selecionar data",
      time: "Selecionar hora",
      note: "Adicionar uma nota sobre o follow-up...",
    },
    schedule: "Agendar",
    scheduling: "A agendar...",
    cancel: "Cancelar",
    success: "Follow-up agendado com sucesso",
    error: "Falha ao agendar follow-up",
  },

  lastFollowUps: {
    title: "Últimos Follow-ups",
    description: "Registo de interações e conversas com cliente/investidor",
    addButton: "Adicionar Follow-up",
    editButton: "Editar",
    deleteButton: "Eliminar",
    empty: "Ainda não há follow-ups registados",
    followUpDate: "Data do Follow-up",
    description_label: "Descrição",
    contactedBy: "Contactado Por",
    personContacted: "Pessoa Contactada",
    createdAt: "Registado em",
    addDialog: {
      title: "Adicionar Follow-up",
      description: "Registe detalhes sobre esta interação com cliente/investidor",
      save: "Guardar Follow-up",
      saving: "A guardar...",
      cancel: "Cancelar",
    },
    editDialog: {
      title: "Editar Follow-up",
      description: "Atualizar detalhes do follow-up",
      save: "Guardar Alterações",
      saving: "A guardar...",
      cancel: "Cancelar",
    },
    deleteDialog: {
      title: "Eliminar Follow-up",
      description: "Tem a certeza de que deseja eliminar este follow-up? Esta ação não pode ser desfeita.",
      confirm: "Eliminar",
      cancel: "Cancelar",
    },
    labels: {
      followUpDate: "Data do Follow-up",
      description: "Descrição",
      contactedBy: "Membro da Equipa (Contactou)",
      personContacted: "Cliente/Investidor (Foi Contactado)",
      selectDate: "Selecione a data",
      selectPerson: "Selecione a pessoa",
      descriptionPlaceholder: "Descreva o que foi discutido durante esta interação...",
    },
    validation: {
      dateRequired: "A data do follow-up é obrigatória",
      descriptionRequired: "A descrição é obrigatória",
      contactedByRequired: "Por favor selecione quem contactou",
      personContactedRequired: "Por favor selecione quem foi contactado",
    },
  },

  toast: {
    success: "Operação concluída com sucesso",
    error: "Ocorreu um erro. Por favor, tente novamente.",
  },
};
