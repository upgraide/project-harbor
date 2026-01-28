export default {
  title: "Criar Oportunidade",
  createButtonText: "Criar Oportunidade",
  creatingButtonText: "Criando...",
  cancelButtonText: "Cancelar",
  basicInformationCard: {
    title: "Informações Básicas",
    name: {
      label: "Nome da Oportunidade",
      placeholder: "Digite o nome da oportunidade",
      description: "Dê um nome único e descritivo à sua oportunidade",
    },
    description: {
      label: "Descrição",
      placeholder: "Digite uma descrição detalhada da oportunidade",
      description: "Forneça uma descrição abrangente da oportunidade",
    },
  },
  financialInformationCard: {
    title: "Informações Financeiras (Pré-NDA)",
    preNDANotes: {
      label: "Notas Pré-NDA",
      placeholder: "Digite as notas sobre esta oportunidade antes do NDA",
      description: "Adicione qualquer nota ou observação adicional",
    },
    table: {
      header: {
        metric: "Métrica",
        value: "Valor",
        actions: "Ações",
      },
      body: {
        type: {
          label: "Tipo",
          placeholder: "Selecione o tipo de oportunidade",
          values: {
            BUY_IN: "Buy In",
            BUY_OUT: "Buy Out",
            BUY_IN_BUY_OUT: "Buy In / Buy Out",
          },
          description: "Selecione o tipo de oportunidade",
        },
        typeDetails: {
          label: "Detalhes do Tipo",
          placeholder: "Selecione os detalhes do tipo de oportunidade",
          values: {
            MAIORITARIO: "Maioritário",
            MINORITARIO: "Minoritário",
            FULL_OWNERSHIP: "100%",
          },
          description: "Selecione os detalhes do tipo de oportunidade",
        },
        industry: {
          label: "Setor",
          placeholder: "Selecione o setor da oportunidade",
          values: {
            SERVICES: "Serviços",
            TRANSFORMATION_INDUSTRY: "Indústria de Transformação",
            TRADING: "Comércio",
            ENERGY_INFRASTRUCTURE: "Energia e Infraestrutura",
            FITNESS: "Fitness",
            HEALTHCARE_PHARMACEUTICALS: "Saúde e Farmacêutica",
            IT: "Tecnologia da Informação",
            TMT: "TMT (Tecnologia, Mídia e Telecom)",
            TRANSPORTS: "Transportes",
          },
          description: "Selecione o setor da oportunidade",
        },
        industrySubsector: {
          label: "Subssetor da Indústria",
          placeholder: "Selecione o subssetor da indústria da oportunidade",
          values: {
            BUSINESS_SERVICES: "Serviços Empresariais",
            FINANCIAL_SERVICES: "Serviços Financeiros",
            CONSTRUCTION_MATERIALS: "Materiais de Construção",
            FOOD_BEVERAGES: "Alimentos e Bebidas",
            OTHERS: "Outros",
          },
          description: "Selecione o subssetor da indústria da oportunidade",
        },
        sales: {
          label: "Vendas",
          placeholder: "Selecione as vendas da oportunidade",
          values: {
            RANGE_0_5: "€0-5M ",
            RANGE_5_10: "€5-10M",
            RANGE_10_15: "€10-15M",
            RANGE_20_30: "€20-30M",
            RANGE_30_PLUS: "€30M+",
          },
          description: "Selecione a faixa de vendas da oportunidade",
        },
        ebitda: {
          label: "EBITDA",
          placeholder: "Selecione o EBITDA da oportunidade",
          values: {
            RANGE_1_2: "€1-2M",
            RANGE_2_3: "€2-3M",
            RANGE_3_5: "€3-5M",
            RANGE_5_PLUS: "€5M+",
          },
          description: "Selecione a faixa de EBITDA da oportunidade",
        },
        ebitdaNormalized: {
          label: "EBITDA (Normalizado)",
          placeholder: "Digite o valor de EBITDA Normalizado em euros (exemplo: 150000)",
          description: "Digite o valor absoluto de EBITDA Normalizado da oportunidade",
          units: "€",
        },
        netDebt: {
          label: "Dívida Líquida",
          placeholder: "Digite o valor de Dívida Líquida (exemplo: 3,2)",
          description: "Digite o valor de Dívida Líquida da oportunidade",
          prefix: "€",
          units: "M",
        },
        salesCAGR: {
          label: "CAGR de Vendas",
          placeholder: "Digite o valor de CAGR de Vendas (exemplo: 22)",
          description: "Digite o valor de CAGR de Vendas da oportunidade",
          units: "%",
        },
        ebitdaCAGR: {
          label: "CAGR de EBITDA",
          placeholder: "Digite o valor de CAGR de EBITDA (exemplo: 22)",
          description: "Digite o valor de CAGR de EBITDA da oportunidade",
          units: "%",
        },
        assetIncluded: {
          label: "Ativos Inclusos",
          yes: "Sim",
          no: "Não",
          description: "Selecione se os ativos estão inclusos na oportunidade",
          placeholder: "Selecione se os ativos estão inclusos",
        },
        estimatedAssetValue: {
          label: "Valor Estimado de Ativos",
          placeholder: "Digite o Valor Estimado de Ativos (exemplo: 3,2)",
          description: "Digite o Valor Estimado de Ativos da oportunidade",
          prefix: "€",
          units: "M",
        },
      },
    },
  },
  postNDACard: {
    title: "Informações Adicionais (Pós-NDA)",
    postNDANotes: {
      label: "Notas Pós-NDA",
      placeholder: "Digite as notas sobre esta oportunidade após NDA",
      description: "Adicione qualquer nota ou observação adicional após NDA",
    },
    table: {
      header: {
        metric: "Métrica",
        value: "Valor",
        actions: "Ações",
      },
      body: {
        im: {
          label: "IM",
          placeholder: "Digite o link do IM (ex: URL do Google Drive)",
          description: "Digite o link/URL do Memorando de Informação",
        },
        enterpriseValue: {
          label: "Valor da Empresa (EV)",
          placeholder: "Digite o Valor da Empresa (exemplo: 50)",
          description: "Digite o Valor da Empresa da oportunidade",
          prefix: "€",
          units: "M",
        },
        equityValue: {
          label: "Valor do Patrimônio",
          placeholder: "Digite o Valor do Patrimônio (exemplo: 30)",
          description: "Digite o Valor do Patrimônio da oportunidade",
          prefix: "€",
          units: "M",
        },
        evDashEbitdaEntry: {
          label: "EV/EBITDA (Entrada)",
          placeholder:
            "Digite o múltiplo de EV/EBITDA (Entrada) (exemplo: 8,5)",
          description:
            "Digite o múltiplo de EV/EBITDA (Entrada) da oportunidade",
          units: "x",
        },
        evDashEbitdaExit: {
          label: "EV/EBITDA (Saída/Comps)",
          placeholder:
            "Digite o múltiplo de EV/EBITDA (Saída/Comps) (exemplo: 12,5)",
          description:
            "Digite o múltiplo de EV/EBITDA (Saída/Comps) da oportunidade",
          units: "x",
        },
        ebitdaMargin: {
          label: "Margem de EBITDA (%)",
          placeholder: "Digite a Margem de EBITDA (exemplo: 25,5)",
          description: "Digite a Margem de EBITDA da oportunidade",
          units: "%",
        },
        fcf: {
          label: "Fluxo de Caixa Livre (FCF)",
          placeholder: "Digite o Fluxo de Caixa Livre (exemplo: 5,2)",
          description: "Digite o Fluxo de Caixa Livre da oportunidade",
          prefix: "€",
          units: "M",
        },
        netDebtDashEbitda: {
          label: "Dívida Líquida/EBITDA",
          placeholder:
            "Digite o múltiplo de Dívida Líquida/EBITDA (exemplo: 3,5)",
          description:
            "Digite o múltiplo de Dívida Líquida/EBITDA da oportunidade",
          units: "x",
        },
        capexItensity: {
          label: "Intensidade de Capex (Capex/EBITDA)",
          placeholder: "Digite a Intensidade de Capex (exemplo: 8,5)",
          description: "Digite a Intensidade de Capex da oportunidade",
          units: "%",
        },
        workingCapitalNeeds: {
          label: "Necessidade de Capital de Giro (% Receita)",
          placeholder: "Digite a Necessidade de Capital de Giro (exemplo: 2,5)",
          description:
            "Digite a Necessidade de Capital de Giro da oportunidade",
          units: "%",
        },
      },
    },
  },
  coInvestmentCard: {
    title: "Informações do Sócio Limitado",
    table: {
      header: {
        metric: "Métrica",
        value: "Valor",
        actions: "Ações",
      },
      body: {
        coInvestment: {
          label: "Co-Investimento",
          yes: "Sim",
          no: "Não",
          description: "Selecione se há co-investimento nesta oportunidade",
          placeholder: "Selecione o status de co-investimento",
        },
        equityContribution: {
          label: "Contribuição de Patrimônio",
          placeholder: "Digite a Contribuição de Patrimônio (exemplo: 25)",
          description: "Digite a Contribuição de Patrimônio da oportunidade",
          units: "%",
        },
        grossIRR: {
          label: "TIR Bruta",
          placeholder: "Digite a TIR Bruta (exemplo: 25)",
          description: "Digite a TIR Bruta da oportunidade",
          units: "%",
        },
        netIRR: {
          label: "TIR Líquida",
          placeholder: "Digite a TIR Líquida (exemplo: 20)",
          description: "Digite a TIR Líquida da oportunidade",
          units: "%",
        },
        moic: {
          label: "MOIC (Múltiplo do Capital Investido)",
          placeholder: "Digite o MOIC (exemplo: 2,5)",
          description: "Digite o MOIC da oportunidade",
          units: "x",
        },
        cashOnCashReturn: {
          label: "Retorno em Caixa",
          placeholder: "Digite o Retorno em Caixa (exemplo: 18)",
          description: "Digite o Retorno em Caixa da oportunidade",
          units: "%",
        },
        cashConvertion: {
          label: "Conversão de Caixa (FCF/EBITDA)",
          placeholder: "Digite a Conversão de Caixa (exemplo: 85)",
          description: "Digite a Conversão de Caixa da oportunidade",
          units: "%",
        },
        entryMultiple: {
          label: "Múltiplo de Entrada",
          placeholder: "Digite o Múltiplo de Entrada (exemplo: 8,5)",
          description: "Digite o Múltiplo de Entrada da oportunidade",
          units: "x",
        },
        exitExpectedMultiple: {
          label: "Múltiplo de Saída Esperado",
          placeholder: "Digite o Múltiplo de Saída Esperado (exemplo: 12,5)",
          description: "Digite o Múltiplo de Saída Esperado da oportunidade",
          units: "x",
        },
        holdPeriod: {
          label: "Período de Retenção (Anos)",
          placeholder: "Digite o Período de Retenção (exemplo: 5)",
          description: "Digite o Período de Retenção da oportunidade",
          units: "anos",
        },
      },
    },
  },
  imagesCard: {
    title: "Imagens",
    uploadButtonText: "Carregar Imagens",
    uploadSuccess: "Imagens carregadas com sucesso",
    maxImagesError: "Não pode exceder 10 imagens no total",
    noImages: "Nenhuma imagem carregada ainda",
  },
  graphCard: {
    title: "Dados do Gráfico",
    addRowButtonText: "Adicionar Linha",
    unitLabel: "Unidade de Exibição",
    millions: "Milhões (M€)",
    thousands: "Milhares (K€)",
    table: {
      header: {
        year: "Ano",
        revenue: "Vendas",
        ebitda: "EBITDA",
        ebitdaMargin: "Margem EBITDA (%)",
        actions: "Ações",
      },
    },
    noDataMessage: "Ainda não há dados do gráfico. Clique em 'Adicionar Linha' para começar.",
    openMenuText: "Abrir menu",
    editButtonText: "Editar",
    editGraphRowTitle: "Editar Linha do Gráfico",
    cancelButtonText: "Cancelar",
    saveButtonText: "Guardar",
    year: "Ano",
    revenue: "Vendas (M€)",
    ebitda: "EBITDA (M€)",
    ebitdaMargin: "Margem EBITDA (%)",
    actions: "Ações",
    deleteButtonText: "Eliminar",
    yearSuffixFuture: "E",
    yearSuffixHistorical: "H",
  },
  teamAssignmentCard: {
    title: "Atribuição de Equipa",
    clientAcquisitioner: {
      label: "Angariação do Investidor",
      placeholder: "Selecione a angariação do investidor",
      description:
        "Selecione a pessoa responsável pela angariação do investidor para esta oportunidade (deve ser um utilizador Team ou Admin)",
    },
    accountManagers: {
      label: "Acompanhamento do Cliente",
      placeholder: "Selecione o acompanhamento do cliente",
      description:
        "Selecione 1 a 2 pessoas para acompanhamento do cliente para esta oportunidade (devem ser utilizadores Team ou Admin)",
    },
  },
} as const;
