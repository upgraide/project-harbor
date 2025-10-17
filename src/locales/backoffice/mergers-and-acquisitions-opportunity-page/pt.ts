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
          label: "Subsetor Industrial",
          placeholder: "Selecione o subsetor industrial da oportunidade",
          values: {
            BUSINESS_SERVICES: "Serviços Empresariais",
            FINANCIAL_SERVICES: "Serviços Financeiros",
            CONSTRUCTION_MATERIALS: "Construção e Materiais",
            FOOD_BEVERAGES: "Alimentos e Bebidas",
            OTHERS: "Outros",
          },
          description: "Selecione o subsetor industrial da oportunidade",
        },
      },
    },
  },
} as const;
