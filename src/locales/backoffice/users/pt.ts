export default {
  title: "Usuários",
  description: "Gerencie e visualize todos os usuários do sistema",
  searchPlaceholder: "Pesquisar por nome ou email...",
  newButtonLabel: "Adicionar Usuário",
  errorMessage: "Falha ao carregar usuários. Por favor, tente novamente.",
  emptyMessage: "Nenhum usuário encontrado.",
  table: {
    name: "Nome",
    email: "Email",
    joinedDate: "Data de Entrada",
    lastLogin: "Último Acesso",
    neverLoggedIn: "Nunca acessou",
    status: "Status",
    actions: "Ações",
    active: "Ativo",
    inactive: "Inativo",
  },
  deleteDialog: {
    title: "Deletar Usuário",
    description:
      "Tem certeza que deseja deletar {name}? Esta ação não pode ser desfeita.",
    confirm: "Deletar",
    cancel: "Cancelar",
  },
} as const;
