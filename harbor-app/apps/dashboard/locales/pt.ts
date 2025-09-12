export default {
  dashboard: {
    title: "As Nossas Oportunidades",
    description:
      "Explore as nossas oportunidades de investimento e encontre a mais adequada para si",
    bodyTitle: "Comece Agora",
    bodyDescription: "Para começar, por favor selecione uma nova oportunidade",
    bodyTip:
      "Dica: Pode optar por co-investir ou tornar-se investidor principal clicando no botão abaixo",
    documentationLink: "Saber Mais",

    navigation: {
      dashboard: "Painel de Oportunidades",
      opportunities: "Oportunidades",
      personalAccount: "Conta Pessoal",
      investors: "Investidores",
      settings: "Configurações",
      help: "Ajuda",
      logout: "Sair",
      language: "Idioma",
      theme: "Tema",
    },
  },
  error: {
    title: "Ocorreu um erro",
    description:
      "Ocorreu um erro inesperado. Por favor, tente novamente ou contacte-nos se o problema persistir.",
    tryAgain: "Tentar novamente",
    contactUs: "Contacte-nos",
  },
  notFound: {
    title: "Não encontrado",
    description: "Não foi possível encontrar o recurso solicitado",
    returnHome: "Voltar para a página inicial",
  },
  consentBanner: {
    description:
      "Este site utiliza tecnologias de rastreio. Pode optar por aceitar ou recusar o uso destas tecnologias.",
    deny: "Recusar",
    accept: "Aceitar",
  },
  login: {
    title: "Bem-vindo à Plataforma da Harbor Partners",
    description: "Introduza o seu email e password para continuar",
    footer: "Ao entrar, concorda com os nossos",
    termsOfService: "Termos de Serviço",
    privacyPolicy: "Política de Privacidade",
    toastTitle: {
      couldNotSignIn: "Não foi possível entrar, por favor tente novamente.",
      emailRequired: "O Email é obrigatório.",
      passwordRequired: "A Password é obrigatória.",
    },
  },
  settings: {
    title: "Definições",
    headerTitle: "Definições",
    headerDescription: "Gerir as suas definições da conta.",
    sidebar: {
      general: "Geral",
    },
    avatar: {
      title: "Imagem de Perfil",
      description: "Esta é a sua imagem de perfil. Será exibida no seu perfil.",
      uploadHint:
        "Clique na imagem de perfil para carregar uma imagem dos seus ficheiros.",
      resetButton: "Remover",
    },
    handleUpdateUserImage: {
      toast: {
        loading: "A atualizar a imagem de perfil...",
        success: "Imagem de perfil atualizada com sucesso!",
        error: "Não foi possível atualizar a imagem de perfil",
      },
    },
    handleUpdateUsername: {
      toast: {
        loading: "A atualizar o nome do utilizador...",
        success: "Nome do utilizador atualizado com sucesso!",
        error: "Não foi possível atualizar o nome do utilizador",
      },
    },
    handleRemoveUserImage: {
      toast: {
        loading: "A remover a imagem de perfil...",
        success: "Imagem de perfil removida com sucesso!",
        error: "Não foi possível remover a imagem de perfil",
      },
    },
    username: {
      title: "Nome do Utilizador",
      description: "Primeiro nome e último nome. Será exibido no seu perfil.",
      saveButton: "Guardar",
      warning: "Por favor, use 32 caracteres no máximo.",
    },
  },
} as const;
