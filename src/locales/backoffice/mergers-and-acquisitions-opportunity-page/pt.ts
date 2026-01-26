export default {
  breadcrumb: "Oportunidades de Fusão e Aquisição",
  loadingMessage: "A carregar a oportunidade...",
  errorMessage: "Erro ao carregar a oportunidade...",
  saveButtonText: "Guardar",
  cancelButtonText: "Cancelar",
  description: "Descrição",
  editDescription: "Editar descrição",
  editButtonText: "Editar",
  financialInformationCard: {
    title: "Informação Financeira (Pre-NDA)",
    table: {
      header: {
        metric: "Métrica",
        value: "Valor",
        actions: "Ações",
      },
      body: {
        type: {
          label: "Tipo",
          placeholder: "Selecione o tipo da oportunidade",
          values: {
            BUY_IN: "Capital para Expansão",
            BUY_OUT: "Venda de Participação",
            BUY_IN_BUY_OUT: "Capital para Expansão/Venda de Participação",
          },
          description: "Selecione o tipo da oportunidade",
        },
        typeDetails: {
          label: "Tipo de Detalhes",
          placeholder: "Selecione o tipo de detalhes da oportunidade",
          values: {
            MAIORITARIO: "Maioritário",
            MINORITARIO: "Minoritário",
            FULL_OWNERSHIP: "100%",
          },
          description: "Selecione o tipo de detalhes da oportunidade",
        },
        industry: {
          label: "Indústria",
          placeholder: "Selecione a indústria da oportunidade",
          values: {
            SERVICES: "Serviços",
            TRANSFORMATION_INDUSTRY: "Indústria Transformadora",
            TRADING: "Comércio",
            ENERGY_INFRASTRUCTURE: "Energia e Infraestruturas",
            FITNESS: "Fitness",
            HEALTHCARE_PHARMACEUTICALS: "Saúde e Farmacêutica",
            IT: "Tecnologia da Informação",
            TMT: "TMT (Tecnologia, Media e Telecomunicações)",
            TRANSPORTS: "Transportes",
          },
          description: "Selecione a indústria da oportunidade",
        },
        industrySubsector: {
          label: "Subsetor da Indústria",
          placeholder: "Selecione o subsector da indústria da oportunidade",
          values: {
            BUSINESS_SERVICES: "Serviços Empresariais",
            FINANCIAL_SERVICES: "Serviços Financeiros",
            CONSTRUCTION_MATERIALS: "Construção e Materiais",
            FOOD_BEVERAGES: "Alimentos e Bebidas",
            OTHERS: "Outros",
          },
          description: "Selecione o subsector da indústria da oportunidade",
        },
        dimension: {
          label: "Dimensão",
        },
        sales: {
          label: "Vendas",
          placeholder: "Selecione o range de vendas da oportunidade",
          values: {
            RANGE_0_5: "€0-5M",
            RANGE_5_10: "€5-10M",
            RANGE_10_15: "€10-15M",
            RANGE_20_30: "€20-30M",
            RANGE_30_PLUS: "€30+M",
          },
          description: "Selecione o range de vendas da oportunidade",
        },
        ebitda: {
          label: "EBITDA",
          placeholder: "Selecione o range de ebitda da oportunidade",
          values: {
            RANGE_1_2: "€1-2M",
            RANGE_2_3: "€2-3M",
            RANGE_3_5: "€3-5M",
            RANGE_5_PLUS: "€5M+",
          },
          description: "Selecione o range de ebitda da oportunidade",
        },
        ebitdaNormalized: {
          label: "EBITDA (Ajustado)",
          placeholder: "Insira o valor de EBITDA (Ajustado) em euros (exemplo: 150000)",
          description: "Insira o valor absoluto de EBITDA (Ajustado) da oportunidade",
          units: "€",
        },
        netDebt: {
          label: "Net Debt",
          placeholder: "Insira o valor da Net Debt (exemplo: 3.2)",
          description: "Insira o valor da Net Debt da oportunidade",
          prefix: "€",
          units: "M",
        },
        CAGRs: {
          label: "CAGRs",
        },
        salesCAGR: {
          label: "CAGR de Vendas",
          placeholder: "Insira o valor do CAGR de Vendas (exemplo: 22)",
          description: "Insira o valor do CAGR de Vendas da oportunidade",
          units: "%",
        },
        ebitdaCAGR: {
          label: "EBITDA CAGR",
          placeholder: "Insira o valor do EBITDA CAGR (exemplo: 22)",
          description: "Insira o valor do EBITDA CAGR da oportunidade",
          units: "%",
        },
        asset: {
          label: "Ativo",
        },
        assetIncluded: {
          label: "Ativo Incluído",
          yes: "Sim",
          no: "Não",
          placeholder: "Sim ou Não",
          description: "Indique se o ativo está incluído na oportunidade",
        },
        estimatedAssetValue: {
          label: "Valor Estimado do Ativo",
          placeholder: "Insira o valor estimado do ativo (exemplo: 3.2)",
          description: "Insira o valor estimado do ativo da oportunidade",
          prefix: "€",
          units: "M",
        },
      },
    },
  },
  graphCard: {
    title: "Dados do Gráfico",
    addRowButtonText: "Adicionar Linha",
    unitLabel: "Unidade de Exibição",
    millions: "Milhões (M€)",
    thousands: "Milhares (K€)",
    yearSuffixHistorical: "H",
    yearSuffixFuture: "E",
    table: {
      header: {
        year: "Ano",
        revenue: "Vendas",
        ebitda: "EBITDA",
        ebitdaMargin: "Margem EBITDA (%)",
        actions: "Ações",
      },
    },
    noDataMessage:
      "Não há dados no gráfico ainda. Clique em 'Adicionar Linha' para começar.",
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
  },
  imagesCard: {
    title: "Imagens",
    uploadSuccess: "Imagens carregadas com sucesso",
    noImages: "Nenhuma imagem carregada ainda",
    maxImagesError: "Não é possível exceder 10 imagens no total",
    uploadButtonText: "Carregar Imagens",
  },
  postNDACard: {
    title: "Informação Pós-NDA",
    table: {
      header: {
        metric: "Métrica",
        value: "Valor",
        actions: "Ações",
      },
      body: {
        im: {
          label: "IM",
          description: "Insira o link/URL do Memorando de Informação",
          placeholder: "Insira o link do IM (ex: URL do Google Drive)",
        },
        enterpriseValue: {
          label: "Valor da Empresa",
          placeholder: "Insira o Valor da Empresa (exemplo: 50)",
          description: "Insira o Valor da Empresa da oportunidade",
          prefix: "€",
          units: "M",
        },
        equityValue: {
          label: "Valor do Capital Próprio",
          placeholder: "Insira o Valor do Capital Próprio (exemplo: 30)",
          description: "Insira o Valor do Capital Próprio da oportunidade",
          prefix: "€",
          units: "M",
        },
        evDashEbitdaEntry: {
          label: "Múltiplo EBITDA Entrada",
          placeholder: "Insira o Múltiplo EBITDA Entrada (exemplo: 8.5)",
          description: "Insira o Múltiplo EBITDA Entrada da oportunidade",
          units: "x",
        },
        evDashEbitdaExit: {
          label: "Múltiplo EBITDA Comparáveis",
          placeholder: "Insira o Múltiplo EBITDA Comparáveis (exemplo: 12.5)",
          description: "Insira o Múltiplo EBITDA Comparáveis da oportunidade",
          units: "x",
        },
        ebitdaMargin: {
          label: "EBITDA Margin (%)",
          placeholder: "Insira a EBITDA Margin (exemplo: 25.5)",
          description: "Insira a EBITDA Margin da oportunidade",
          units: "%",
        },
        fcf: {
          label: "Cash Flows Descontados",
          placeholder: "Insira o Cash Flows Descontados (exemplo: 5.2)",
          description: "Insira o Cash Flows Descontados da oportunidade",
          units: "M€",
        },
        netDebtDashEbitda: {
          label: "EBITDA por Dívida Financeira Líquida (x)",
          placeholder:
            "Insira o EBITDA por Dívida Financeira Líquida (x) (exemplo: 3.5)",
          description:
            "Insira o EBITDA por Dívida Financeira Líquida (x) da oportunidade",
          units: "x",
        },
        capexItensity: {
          label: "Intensidade de Investimento em Capital",
          placeholder:
            "Insira a Intensidade de Investimento em Capital (exemplo: 8.5)",
          description:
            "Insira a Intensidade de Investimento em Capital da oportunidade",
          units: "%",
        },
        workingCapitalNeeds: {
          label: "Necessidades de Fundo de Maneio",
          placeholder:
            "Insira as Necessidades de Fundo de Maneio (exemplo: 2.5)",
          description:
            "Insira as Necessidades de Fundo de Maneio da oportunidade",
          units: "%",
        },
      },
    },
  },
  shareholderStructureCard: {
    title: "Estrutura de Acionistas",
    uploadSuccess: "Imagens da estrutura de acionistas carregadas com sucesso",
    noImages: "Nenhuma imagem da estrutura de acionistas carregada ainda",
    uploadButtonText: "Carregar Imagens",
  },
  coInvestmentCard: {
    title: "Limited Partner Information",
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
          label: "Contribuição de Capital",
          placeholder: "Insira a Contribuição de Capital (exemplo: 25)",
          description: "Insira a Contribuição de Capital da oportunidade",
          units: "%",
        },
        grossIRR: {
          label: "TIR Bruta",
          placeholder: "Insira a TIR Bruta (exemplo: 25)",
          description: "Insira a TIR Bruta da oportunidade",
          units: "%",
        },
        netIRR: {
          label: "TIR Líquida",
          placeholder: "Insira a TIR Líquida (exemplo: 20)",
          description: "Insira a TIR Líquida da oportunidade",
          units: "%",
        },
        moic: {
          label: "MOIC (Múltiplo sobre o Capital Investido)",
          placeholder: "Insira o MOIC (exemplo: 2.5)",
          description: "Insira o Múltiplo de Dinheiro (MOIC) da oportunidade",
          units: "x",
        },
        cashOnCashReturn: {
          label: "Retorno Cash-on-Cash",
          placeholder: "Insira o Retorno Cash-on-Cash (exemplo: 18)",
          description: "Insira o Retorno Cash-on-Cash da oportunidade",
          units: "%",
        },
        cashConvertion: {
          label: "Conversão de Caixa (FCF/EBITDA)",
          placeholder: "Insira a Conversão de Caixa (exemplo: 85)",
          description: "Insira a Conversão de Caixa da oportunidade",
          units: "%",
        },
        entryMultiple: {
          label: "Múltiplo de Entrada",
          placeholder: "Insira o Múltiplo de Entrada (exemplo: 8.5)",
          description: "Insira o Múltiplo de Entrada da oportunidade",
          units: "x",
        },
        exitExpectedMultiple: {
          label: "Múltiplo de Saída Esperado",
          placeholder: "Insira o Múltiplo de Saída Esperado (exemplo: 12.5)",
          description: "Insira o Múltiplo de Saída Esperado da oportunidade",
          units: "x",
        },
        holdPeriod: {
          label: "Período de Investimento (Anos)",
          placeholder: "Insira o Período de Investimento (exemplo: 5)",
          description: "Insira o Período de Investimento da oportunidade",
          units: "anos",
        },
      },
    },
  },
  teamAssignmentCard: {
    title: "Atribuição de Equipa",
    clientAcquisitioner: {
      label: "Angariação do Investidor",
    },
    accountManagers: {
      label: "Acompanhamento do Cliente",
    },
  },
} as const;
