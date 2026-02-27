export default {
  title: "Pedidos de Acesso",
  description: "Gerir pedidos de acesso pendentes à plataforma",
  emptyMessage: "Sem pedidos de acesso pendentes",
  errorMessage: "Erro ao carregar pedidos de acesso",
  table: {
    name: "Nome",
    email: "Email",
    company: "Empresa",
    phone: "Telefone",
    position: "Cargo",
    date: "Data",
    actions: "Ações",
  },
  approveButton: "Aprovar",
  rejectButton: "Rejeitar",
  approving: "A aprovar...",
  rejecting: "A rejeitar...",
  approveSuccess: "Pedido aprovado e convite enviado",
  rejectSuccess: "Pedido de acesso rejeitado",
  rejectDialog: {
    title: "Rejeitar Pedido de Acesso",
    description:
      "Tem a certeza que deseja rejeitar o pedido de acesso de {name}? Esta ação não pode ser revertida.",
    confirm: "Rejeitar",
    cancel: "Cancelar",
  },
} as const;
