export default {
  title: "Definições",
  updateProfileCard: {
    title: "O seu nome",
    description: "Este é o seu nome. Ele será exibido no seu perfil.",
    placeholder: "Primeiro e último nome",
    warning: "Por favor, use no máximo 32 caracteres.",
    saveButton: "Salvar",
    toast: {
      success: "Nome atualizado com sucesso!",
      error: "Falha ao atualizar nome. Por favor, tente novamente.",
      loading: "A atualizar o nome...",
    },
  },
  updateAvatarCard: {
    title: "O seu avatar",
    description: "Este é o seu avatar. Ele será exibido no seu perfil.",
    uploadHint:
      "Clique no avatar para fazer o upload de um personalizado a partir dos seus arquivos.",
    resetButton: "Apagar",
    uploadToast: {
      success: "Avatar atualizado com sucesso!",
      error: "Falha ao atualizar avatar. Por favor, tente novamente.",
      loading: "A atualizar o avatar...",
    },
    removeToast: {
      success: "Avatar apagado com sucesso!",
      error: "Falha ao apagar avatar. Por favor, tente novamente.",
      loading: "A apagar o avatar...",
    },
  },
} as const;
