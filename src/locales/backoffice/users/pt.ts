export default {
  title: "Utilizadores",
  description: "Gerencie e visualize todos os utilizadores do sistema",
  searchPlaceholder: "Pesquisar por nome ou email...",
  newButtonLabel: "Adicionar Utilizador",
  errorMessage: "Falha ao carregar utilizadores. Por favor, tente novamente.",
  emptyMessage: "Nenhum utilizador encontrado.",
  table: {
    name: "Nome",
    email: "Email",
    joinedDate: "Data de Entrada",
    lastLogin: "Último Acesso",
    neverLoggedIn: "Nunca acedeu",
    status: "Status",
    actions: "Ações",
    active: "Ativo",
    inactive: "Inativo",
  },
  deleteDialog: {
    title: "Eliminar Utilizador",
    description:
      "Tem certeza que deseja eliminar {name}? Esta ação não pode ser desfeita.",
    confirm: "Eliminar",
    cancel: "Cancelar",
  },
  inviteDialog: {
    title: "Convidar Utilizador",
    description: "Envie um convite para o utilizador aceder ao sistema",
    labels: {
      name: "Nome Completo",
      email: "Endereço de e-mail",
      language: "Idioma",
    },
    languages: {
      english: "Inglês",
      portuguese: "Português",
    },
    send: "Enviar convite",
    sending: "A enviar...",
    cancel: "Cancelar",
  },
} as const;
