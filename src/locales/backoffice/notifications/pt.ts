export default {
  title: "Notificações",
  description: "Gerir pedidos de acesso e ver notificações",
  empty: "Nenhum pedido de acesso encontrado",
  filter: {
    status: "Filtrar por estado",
    all: "Todos",
    pending: "Pendente",
    approved: "Aprovado",
    rejected: "Rejeitado",
  },
  fields: {
    company: "Empresa",
    position: "Cargo",
    phone: "Telefone",
    createdAt: "Criado em",
    message: "Mensagem",
  },
  actions: {
    approve: "Aprovar",
    reject: "Rejeitar",
  },
} as const;
