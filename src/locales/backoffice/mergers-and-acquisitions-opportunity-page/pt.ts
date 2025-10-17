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
        },
      },
    },
  },
} as const;
