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
    buttons: {
      signIn: "Entrar",
      requestAccess: "Solicitar acesso",
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
} as const;
