export default {
  ladingPage: {
    title: {
      firstRow: "O SEU",
      secondRow: "PARCEIRO DE",
      thirdRow: "CRESCIMENTO",
    },
    description:
      "Harbor Partners é uma empresa de consultoria de investimentos baseada em Lisboa, dedicada a fornecer serviços holísticos e integrados a clientes institucionais e particulares de alto patrimônio líquido.",
    buttons: {
      requestAccess: "Solicitar acesso",
      membershipLogin: "Login de membro",
    },
  },
  signInPage: {
    title: "Entrar na sua conta",
    description:
      "Insira seu email e palavra-passe abaixo para entrar na sua conta",
    dontHaveAccount: "Não tem uma conta?",
    alreadyHaveAccount: "Já tem uma conta?",
    buttons: {
      signIn: "Entrar",
      requestAccess: "Solicitar acesso",
      membershipLogin: "Login de membro",
      back: "Voltar",
    },
    forgotPassword: "Esqueceu-se da palavra-passe?",
    emailPlaceholder: "m@exemplo.com",
    passwordPlaceholder: "Palavra-passe",
    toastSuccess:
      "Login realizado com sucesso! A ser redirecionado para o dashboard...",
    toastError: "Falha ao fazer login. Por favor, tente novamente.",
    toastResetPasswordSuccess:
      "Verifique seu email para um link para redefinir a sua palavra-passe!",
    toastResetPasswordError:
      "Falha ao enviar link para redefinição de palavra-passe. Por favor, tente novamente!",
  },
  themeSwitcher: {
    light: "Claro",
    dark: "Escuro",
    system: "Sistema",
  },
  resetPasswordPage: {
    invalidLinkCard: {
      title: "Link inválido",
      description:
        "Este link de redefinição de palavra-passe é inválido ou expirou. Por favor, solicite um novo link.",
    },
    resetPasswordCard: {
      title: "Redefinir a sua palavra-passe",
      description:
        "Insira a sua nova palavra-passe abaixo para redefinir a sua palavra-passe",
    },
    schemaMessages: {
      password: {
        min: "A palavra-passe deve ter pelo menos 8 caracteres",
        label: "Nova palavra-passe",
        placeholder: "********",
        description: "Insira a sua nova palavra-passe",
      },
      confirmPassword: {
        min: "A confirmação da palavra-passe deve ter pelo menos 8 caracteres",
        match: "Passwords do not match",
        label: "Confirm Password",
        placeholder: "********",
        description: "Confirme a sua nova palavra-passe",
      },
      error: {
        default:
          "Falha ao redefinir a palavra-passe. Por favor, tente novamente.",
      },
    },
    buttons: {
      submit: "Redefinir a sua palavra-passe",
    },
  },
  dashboard: {
    header: {
      title: "Painel de Oportunidades",
      description: "Bem-vindo ao seu painel de oportunidades",
    },
    navigation: {
      dashboard: "Painel",
      settings: "Configurações",
      theme: "Tema",
      language: "Idioma",
      logout: "Sair",
      toastLogoutSuccess: "Saiu com sucesso!",
      toastLogoutError: "Falha ao sair. Por favor, tente novamente.",
    },
    settings: {
      general: "Geral",
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
      updateNameCard: {
        title: "O seu nome",
        description: "Este é o seu nome. Ele será exibido no seu perfil.",
        label: "Primeiro e último nome",
        placeholder: "Primeiro e último nome",
        warning: "Por favor, use no máximo 32 caracteres.",
        saveButton: "Salvar",
        toast: {
          success: "Nome atualizado com sucesso!",
          error: "Falha ao atualizar nome. Por favor, tente novamente.",
          loading: "A atualizar o nome...",
        },
      },
    },
  },
  backoffice: {
    sidebar: {
      navigationItems: {
        opportunitiesMA: "Opportunidades M&A",
        opportunitiesRealEstate: "Opportunidades Real Estate",
        investors: "Investidores",
        team: "Equipa",
      },
      searchPlaceholder: "Pesquisar...",
    },
    mergersAndAcquisitions: {
      create: {
        breadcrumb: {
          title: "Mergers and Acquisitions",
          create: "Criar",
        },
      },
    },
  },
  requestAccessPage: {
    title: "Solicitar acesso",
    description:
      "Insira seus detalhes abaixo para solicitar acesso à plataforma",
    message: {
      label: "Mensagem",
      placeholder: "Porque é que está interessado?",
    },
    name: {
      label: "Nome",
      placeholder: "Insira o seu nome",
    },
    email: {
      label: "Email",
      placeholder: "exemplo@exemplo.com",
    },
    company: {
      label: "Empresa",
      placeholder: "Insira o nome da sua empresa",
    },
    position: {
      label: "Cargo",
      placeholder: "Insira o seu cargo na sua empresa",
    },
    phone: {
      label: "Telefone",
      placeholder: "Insira o seu número de telefone",
    },
    buttons: {
      submit: "Solicitar acesso",
    },
    schemaMessages: {
      name: {
        required: "Nome é obrigatório",
      },
      email: {
        invalid: "Email inválido",
      },
      company: {
        required: "Empresa é obrigatória",
      },
      phone: {
        required: "Telefone é obrigatório",
        min: "Telefone deve ter pelo menos 9 dígitos",
        max: "Telefone deve ter exatamente 9 dígitos",
      },
      position: {
        required: "Cargo é obrigatório",
      },
      message: {
        required: "Mensagem é obrigatória",
        min: "Mensagem deve ter pelo menos 3 caracteres",
        max: "Mensagem deve ter menos de 1000 caracteres",
      },
    },
  },
} as const;
