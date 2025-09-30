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
  backofficeMergersAndAcquisitionsOpportunityPage: {
    breadcrumbs: {
      mergersAndAcquisitionsOpportunities:
        "Mergers and Acquisitions Opportunities",
    },
    imagesCard: {
      title: "Imagens",
      buttons: {
        add: "Adicionar Imagem",
      },
    },
    descriptionCard: {
      title: "Descrição",
      buttons: {
        edit: "Editar Descrição",
      },
    },
    financialPerformanceCard: {
      title: "Performance Financeira",
      graphRowsCard: {
        title: "Linhas do Gráfico",
        buttons: {
          add: "Adicionar Linha ao Gráfico",
        },
        table: {
          year: "Ano",
          revenue: "Receita",
          ebitda: "EBITDA",
          buttons: {
            edit: "Editar",
            delete: "Apagar",
          },
        },
      },
    },
    preNDAInformationCard: {
      title: "Informação Pre-NDA",
      table: {
        buttons: {
          edit: "Editar",
          delete: "Apagar",
        },
        metric: "Métrica",
        value: "Valor",
        actions: "Ações",
        type: "Tipo",
        typeDetails: "Detalhes do Tipo",
        industry: "Indústria",
        industrySubsector: "Subsetor da Indústria",
        dimension: "Dimensão",
        sales: "Vendas",
        ebitda: "EBITDA",
        ebitdaNormalized: "EBITDA (Normalized)",
        netDebt: "Net Debt",
        cagr: "CAGR",
        salesCAGR: "Sales CAGR",
        ebitdaCAGR: "EBITDA CAGR",
        asset: "Ativo",
        assetIncluded: "Ativo Incluído",
        estimatedAssetValue: "Valor Estimado do Ativo",
        assetIncludedYes: "Sim",
        assetIncludedNo: "Não",
      },
    },
    postNDAInformationCard: {
      title: "Informação Pos-NDA",
      table: {
        metric: "Métrica",
        value: "Valor",
        actions: "Ações",
        im: "IM",
        entrepriseValue: "Entreprise Value",
        equityValue: "Equity Value",
        evDashEbitdaEntry: "EV/EBITDA Entry",
        evDashEbitdaExit: "EV/EBITDA Exit",
        ebitdaMargin: "EBITDA Margin",
        fcf: "FCF",
        netDebtDashEbitda: "Net Debt/EBITDA",
        capexIntensity: "Capex Intensity (Capex/EBITDA)",
        workingCapitalNeeds: "Working Capital Needs",
      },
    },
    shareholderInformationCard: {
      title: "Estrutura Acionista",
      buttons: {
        add: "Adicionar Estrutura Acionista",
      },
    },
    limitedPartnerInformationCard: {
      title: "Informação Limited Partner",
      table: {
        metric: "Métrica",
        value: "Valor",
        actions: "Ações",
        coInvestment: "Co-Investimento",
        equityContribution: "Equity Contribution",
        grossIRR: "Gross IRR",
        netIRR: "Net IRR",
        moic: "MOIC",
        cashOnCashReturn: "Cash On Cash Return",
        cashConvertion: "Cash Convertion",
        entryMultiple: "Entry Multiple",
        exitExpectedMultiple: "Exit Expected Multiple",
        holdPeriod: "Hold Period",
      },
    },
    editOpportunityTypeDialog: {
      title: "Editar Tipo da Oportunidade",
      description: "Selecione o novo tipo da oportunidade",
      toastSuccess: "Tipo da oportunidade atualizado com sucesso",
      toastError: "Falha ao atualizar tipo da oportunidade",
      toastLoading: "Updating opportunity type",
      selectPlaceholder: "Selecione um tipo",
      label: "Tipo",
      buyIn: "Buy In",
      buyOut: "Buy Out",
      buyInBuyOut: "Buy In/Buy Out",
      updateButton: "Atualizar Tipo",
    },
    deleteOpportunityTypeDialog: {
      title: "Apagar Tipo da Oportunidade",
      description:
        "Tem a certeza que deseja apagar o tipo da oportunidade? Esta ação não pode ser desfeita.",
      toastSuccess: "Tipo da oportunidade apagado com sucesso",
      toastError: "Falha ao apagar tipo da oportunidade",
      toastLoading: "A apagar tipo da oportunidade",
      deleteButton: "Apagar",
      cancelButton: "Cancelar",
    },
    editOpportunityTypeDetailsDialog: {
      title: "Editar Detalhes do Tipo da Oportunidade",
      description: "Editar os detalhes do tipo da oportunidade",
      toastSuccess: "Detalhes do tipo da oportunidade atualizados com sucesso",
      toastError: "Falha ao atualizar detalhes do tipo da oportunidade",
      toastLoading: "A atualizar detalhes do tipo da oportunidade",
      selectPlaceholder: "Selecione os detalhes do tipo",
      label: "Detalhes do Tipo",
      majoritarian: "Maoritário",
      minority: "Minoritário",
      hundredPercent: "100%",
      updateButton: "Atualizar Detalhes do Tipo",
    },
    deleteOpportunityTypeDetailsDialog: {
      title: "Apagar Detalhes do Tipo da Oportunidade",
      description:
        "Tem a certeza que deseja apagar os detalhes do tipo da oportunidade? Esta ação não pode ser desfeita.",
      toastSuccess: "Detalhes do tipo da oportunidade apagados com sucesso",
      toastError: "Falha ao apagar detalhes do tipo da oportunidade",
      toastLoading: "A apagar detalhes do tipo da oportunidade",
      deleteButton: "Apagar",
      cancelButton: "Cancelar",
    },
  },
  dashboardCard: {
    viewOpportunity: "Ver Oportunidade",
    createdAt: "Criado à",
    ago: "atrás",
  },
  dashboardMergersAndAcquisitionsOpportunityPage: {
    description: "Descrição",
    financialPerformanceCard: {
      title: "Performance Financeira",
    },
    financialInformationCard: {
      title: "Informação Financeira",
      table: {
        metric: "Métrica",
        value: "Valor",
        type: "Tipo",
        typeDetails: "Detalhes do Tipo",
        industry: "Indústria",
        industrySubsector: "Subsetor da Indústria",
        dimension: "Dimensão",
        sales: "Vendas",
        ebitda: "EBITDA",
        ebitdaNormalized: "EBITDA (Normalized)",
        netDebt: "Net Debt",
        cagr: "CAGR",
        salesCAGR: "Sales CAGR",
        ebitdaCAGR: "EBITDA CAGR",
        asset: "Ativo",
        assetIncluded: "Ativo Incluído",
        estimatedAssetValue: "Valor Estimado do Ativo",
        yes: "Sim",
        no: "Não",
      },
    },
  },
} as const;
