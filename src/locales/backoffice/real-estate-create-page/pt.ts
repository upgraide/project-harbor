export default {
  title: "Criar Oportunidade de Imobiliário",
  createButtonText: "Criar Oportunidade",
  creatingButtonText: "Criando...",
  cancelButtonText: "Cancelar",
  basicInformationCard: {
    title: "Informações Básicas",
    name: {
      label: "Nome da Oportunidade",
      placeholder: "Digite o nome da oportunidade",
      description: "Dê à sua oportunidade um nome único e descritivo",
    },
    description: {
      label: "Descrição",
      placeholder: "Digite uma descrição detalhada da oportunidade",
      description: "Forneça uma descrição abrangente da oportunidade",
    },
  },
  assetInformationCard: {
    title: "Informações de Ativo e Investimento",
    asset: {
      label: "Ativo",
      placeholder: "Selecione o tipo de ativo",
      description: "Selecione o tipo de ativo imobiliário",
      values: {
        AGNOSTIC: "Agnóstico (sem tipologia definida)",
        MIXED: "Misto",
        HOSPITALITY: "Hotelaria",
        LOGISTICS_AND_INDUSTRIAL: "Logística e Industrial",
        OFFICE: "Escritórios",
        RESIDENTIAL: "Residencial",
        SENIOR_LIVING: "Residências Sénior",
        SHOPPING_CENTER: "Retalho",
        STREET_RETAIL: "Street Retail",
        STUDENT_HOUSING: "Residências de Estudantes",
      },
    },
    investment: {
      label: "Investimento",
      placeholder: "Selecione o tipo de investimento",
      description: "Selecione o tipo de estratégia de investimento",
      values: {
        LEASE_AND_OPERATION: "Lease and operate",
        S_AND_L: "S&L",
        CORE: "Core",
        FIX_AND_FLIP: "Fix&Flip",
        REFURBISHMENT: "Reabilitação",
        VALUE_ADD: "Value-add",
        OPPORTUNISTIC: "Oportunistico",
        DEVELOPMENT: "Desenvolvimento",
      },
    },
    location: {
      label: "Localização",
      placeholder: "Digite a localização do imóvel",
      description: "Especifique a localização geográfica do imóvel",
    },
    area: {
      label: "Área (m²)",
      placeholder: "Digite a área total",
      description: "Área construída ou utilizável total em metros quadrados",
    },
    nRoomsLastYear: {
      label: "Numero quartos (Ano Passado)",
      placeholder: "Digite o número de quartos",
      description: "Número de unidades de aluguel ou quartos no ano passado",
    },
    nBeds: {
      label: "Numero camas",
      placeholder: "Digite o número de camas",
      description: "Número total de camas disponíveis",
    },
    noi: {
      label: "NOI (Ultimo ano)",
      placeholder: "Digite o valor do NOI",
      description: "Renda Operacional Líquida em base anual",
    },
    occupancyLastYear: {
      label: "Ocupação (expected)",
      placeholder: "Digite a taxa de ocupação (%)",
      description: "Porcentagem média de ocupação",
    },
    walt: {
      label: "WALT",
      placeholder: "Digite o WALT em anos",
      description: "Prazo médio ponderado do contrato de aluguel restante",
    },
  },
  operationalFinancialCard: {
    title: "Informações Financeiras - Operacional",
    subRent: {
      label: "Sub-Aluguel",
      placeholder: "Digite o valor do sub-aluguel",
      description: "Renda anual de sub-aluguel",
    },
    rentPerSqm: {
      label: "Renda m² / Renda Estimado por m2",
      placeholder: "Digite a renda por m²",
      description: "Aluguel médio por metro quadrado",
    },
    subYield: {
      label: "Sub-Rendimento",
      placeholder: "Digite o sub-rendimento (%)",
      description: "Rendimento em espaço sub-alugado",
    },
    value: {
      label: "Valor do Imóvel",
      placeholder: "Digite o valor do imóvel",
      description: "Valor estimado atual do imóvel",
    },
    yield: {
      label: "Rendimento",
      placeholder: "Digite o rendimento (%)",
      description: "Porcentagem de rendimento anual",
    },
    rent: {
      label: "Renda",
      placeholder: "Digite a renda anual",
      description: "Renda total anual",
    },
    gcaAboveGround: {
      label: "GCA Acima do Solo",
      placeholder: "Digite GCA acima do solo",
      description: "Área locável bruta acima do nível do solo",
    },
    gcaBelowGround: {
      label: "GCA Abaixo do Solo",
      placeholder: "Digite GCA abaixo do solo",
      description: "Área locável bruta abaixo do nível do solo",
    },
    capex: {
      label: "Capex",
      placeholder: "Digite o capex anual",
      description: "Despesa de capital anual necessária",
    },
    capexPerSqm: {
      label: "Capex/m2",
      placeholder: "Digite capex por m²",
      description: "Despesa de capital por metro quadrado",
    },
    sale: {
      label: "Venda",
      placeholder: "Digite o preço de venda",
      description: "Preço de venda esperado ou atual",
    },
    salePerSqm: {
      label: "Venda/m2 ou Exit Yield",
      placeholder: "Digite preço de venda por m²",
      description: "Preço de venda por metro quadrado",
    },
  },
  postNDACard: {
    title: "Informações Pós-NDA",
    license: {
      label: "Licença",
      placeholder: "Digite informações da licença",
      description: "Detalhes da licença operacional ou comercial",
    },
    licenseStage: {
      label: "Fase de licenciamento",
      placeholder: "Digite a fase de licenciamento",
      description: "Status atual do processo de licenciamento",
    },
    irr: {
      label: "IRR",
      placeholder: "Digite a IRR",
      description: "Taxa interna de retorno",
    },
    coc: {
      label: "Retorno Cash-on-Cash",
      placeholder: "Digite o retorno",
      description: "Porcentagem de retorno de caixa",
    },
    holdingPeriod: {
      label: "Duração investimento",
      placeholder: "Digite a duração",
      description: "Período de retenção esperado em anos",
    },
    breakEvenOccupancy: {
      label: "Ocupação Break-even (%)",
      placeholder: "Digite a ocupação de equilíbrio",
      description: "Porcentagem de ocupação necessária para atingir equilíbrio",
    },
    vacancyRate: {
      label: "Vacancy Rate (%)",
      placeholder: "Digite a taxa de vacância",
      description: "Taxa de vacância atual ou esperada",
    },
    estimatedRentValue: {
      label: "Net Operating Income (NOI)",
      placeholder: "Digite o NOI estimado",
      description: "Valor NOI estimado anual",
    },
    occupancyRate: {
      label: "Taxa de ocupação (%)",
      placeholder: "Digite a taxa de ocupação",
      description: "Porcentagem de taxa de ocupação atual",
    },
    moic: {
      label: "MOIC (Múltiplo sobre o Capital Investido)",
      placeholder: "Digite o MOIC",
      description: "Múltiplo de retorno total sobre capital investido",
    },
    price: {
      label: "Preço de Compra",
      placeholder: "Digite o preço de compra",
      description: "Preço de compra original ou planejado",
    },
    totalInvestment: {
      label: "Investimento Total",
      placeholder: "Digite o investimento total",
      description: "Investimento total de capital necessário",
    },
    profitOnCost: {
      label: "Lucro sobre Custo (%)",
      placeholder: "Digite lucro sobre custo",
      description: "Lucro esperado como porcentagem do custo",
    },
    profit: {
      label: "Lucro Esperado",
      placeholder: "Digite o lucro esperado",
      description: "Lucro total esperado do investimento",
    },
    sofCosts: {
      label: "Sof-Costs",
      placeholder: "Digite os custos soft",
      description: "Honorários profissionais e custos soft",
    },
    sellPerSqm: {
      label: "Preço de Venda por m²",
      placeholder: "Digite preço de venda por m²",
      description: "Preço de revenda esperado por metro quadrado",
    },
    gdv: {
      label: "Valor Bruto de Desenvolvimento",
      placeholder: "Digite o GDV",
      description: "Valor total esperado do projeto",
    },
    wault: {
      label: "WAULT - Weighted Average Unexpired Lease Term",
      placeholder: "Digite WAULT",
      description: "Anos de prazo de contrato restante",
    },
    debtServiceCoverageRatio: {
      label: "Debt Service Coverage Ratio (DSCR)",
      placeholder: "Digite DSCR",
      description: "Razão da renda para serviço da dívida",
    },
    expectedExitYield: {
      label: "Yield Esperado de saida (%)",
      placeholder: "Digite yield esperado",
      description: "Rendimento esperado na saída",
    },
    ltv: {
      label: "LTV (Loan-to-Value)",
      placeholder: "Digite LTV (%)",
      description: "Valor do empréstimo como porcentagem do valor do imóvel",
    },
    ltc: {
      label: "LTC (Loan-to-Cost)",
      placeholder: "Digite LTC (%)",
      description: "Valor do empréstimo como porcentagem do custo total",
    },
    yieldOnCost: {
      label: "Yield on Cost (Development Yield)",
      placeholder: "Digite yield on cost",
      description: "Rendimento inicial sobre capital investido",
    },
  },
  coInvestmentCard: {
    title: "Informações de Co-Investimento",
    coInvestment: {
      label: "Co-Investimento",
      yes: "Sim",
      no: "Não",
      description: "Existe co-investimento nesta oportunidade?",
      placeholder: "Selecione status de co-investimento",
    },
    gpEquityValue: {
      label: "Capital Próprio GP",
      placeholder: "Digite capital próprio do GP",
      description: "Valor da contribuição patrimonial do sócio geral",
    },
    gpEquityPercentage: {
      label: "Porcentagem de Patrimônio do GP (%)",
      placeholder: "Digite porcentagem de patrimônio do GP",
      description: "Porcentagem de patrimônio detida pelo sócio geral",
    },
    totalEquityRequired: {
      label: "Capitais Próprios necessários",
      placeholder: "Digite capitais próprios necessários",
      description: "Capital patrimonial total necessário",
    },
    sponsorPresentation: {
      label: "Apresentação Sponsor",
      placeholder: "Digite apresentação do sponsor",
      description: "Documento ou link de apresentação do sponsor",
    },
    promoteStructure: {
      label: "Estrutura Promote",
      placeholder: "Digite estrutura de promote",
      description: "Estrutura do arranjo de promote",
    },
    projectIRR: {
      label: "IRR Projeto (%)",
      placeholder: "Digite IRR do projeto",
      description: "Taxa interna de retorno esperada do projeto",
    },
    investorIRR: {
      label: "IRR Investidor (%)",
      placeholder: "Digite IRR do investidor",
      description: "Retorno esperado para co-investidores",
    },
    coInvestmentHoldPeriod: {
      label: "Duração investimento (anos)",
      placeholder: "Digite duração",
      description: "Período de retenção esperado para co-investidores",
    },
    coInvestmentBreakEvenOccupancy: {
      label: "Ocupação Break-even (%)",
      placeholder: "Digite ocupação de equilíbrio",
      description: "Porcentagem de ocupação de equilíbrio para co-investidores",
    },
  },
} as const;
