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
    title: "Informação Financeira",
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
          placeholder: "Insira o valor de EBITDA (Ajustado)",
          description: "Insira o valor de EBITDA (Ajustado) da oportunidade",
          units: "x",
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
      },
    },
  },
} as const;
