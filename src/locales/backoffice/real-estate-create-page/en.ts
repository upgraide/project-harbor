export default {
  title: "Create Real Estate Opportunity",
  createButtonText: "Create Opportunity",
  creatingButtonText: "Creating...",
  cancelButtonText: "Cancel",
  basicInformationCard: {
    title: "Basic Information",
    name: {
      label: "Opportunity Name",
      placeholder: "Enter the opportunity name",
      description: "Give your opportunity a unique and descriptive name",
    },
    description: {
      label: "Description",
      placeholder: "Enter a detailed description of the opportunity",
      description: "Provide a comprehensive description of the opportunity",
    },
  },
  assetInformationCard: {
    title: "Asset and Investment Information",
    asset: {
      label: "Asset",
      placeholder: "Select the asset",
      description: "Select the type of real estate asset",
      values: {
        AGNOSTIC: "Agnostic",
        MIXED: "Mixed",
        HOSPITALITY: "Hospitality",
        LOGISTICS_AND_INDUSTRIAL: "Logistics & Industrial",
        OFFICE: "Office",
        RESIDENTIAL: "Residential",
        SENIOR_LIVING: "Senior Living",
        SHOPPING_CENTER: "Shopping Centers",
        STREET_RETAIL: "Street Retail",
        STUDENT_HOUSING: "Student Housing",
      },
    },
    investment: {
      label: "Investment Type",
      placeholder: "Select the investment type",
      description: "Select the type of investment strategy",
      values: {
        LEASE_AND_OPERATION: "Lease and operate",
        S_AND_L: "S&L",
        CORE: "Core",
        FIX_AND_FLIP: "Fix&Flip",
        REFURBISHMENT: "Refurbshiment",
        VALUE_ADD: "Value-add",
        OPPORTUNISTIC: "Opportunistic",
        DEVELOPMENT: "Development",
      },
    },
    location: {
      label: "Location",
      placeholder: "Enter the property location",
      description: "Specify the geographic location of the property",
    },
    area: {
      label: "Area (sqm)",
      placeholder: "Enter the total area",
      description: "Total built-up or usable area in square meters",
    },
    nRoomsLastYear: {
      label: "Number of Rooms (Last Year)",
      placeholder: "Enter the number of rooms",
      description: "Number of rental units or rooms in the last year",
    },
    nBeds: {
      label: "Number of Bedrooms",
      placeholder: "Enter the number of bedrooms",
      description: "Total number of bedrooms available",
    },
    noi: {
      label: "NOI (Net Operating Income)",
      placeholder: "Enter the NOI value",
      description: "Net Operating Income on an annual basis",
    },
    occupancyLastYear: {
      label: "Occupancy (Last Year)",
      placeholder: "Enter the occupancy rate (%)",
      description: "Average occupancy rate percentage",
    },
    walt: {
      label: "WALT",
      placeholder: "Enter the WALT in years",
      description: "Weighted average lease term remaining",
    },
  },
  operationalFinancialCard: {
    title: "Financial Information - Operational",
    subRent: {
      label: "Sub-Rent",
      placeholder: "Enter the sub-rent value",
      description: "Annual sub-rental income",
    },
    rentPerSqm: {
      label: "Rent m² / ERV (Estimated Rental Value)",
      placeholder: "Enter rent per sqm",
      description: "Average rent per square meter",
    },
    subYield: {
      label: "Sub-Yield",
      placeholder: "Enter the sub-yield (%)",
      description: "Yield on sub-rented space",
    },
    value: {
      label: "Value",
      placeholder: "Enter the property value",
      description: "Current estimated value of the property",
    },
    yield: {
      label: "Yield",
      placeholder: "Enter the yield (%)",
      description: "Annual yield percentage",
    },
    rent: {
      label: "Rent",
      placeholder: "Enter the rent",
      description: "Total rental income",
    },
    gcaAboveGround: {
      label: "GCA Above Ground",
      placeholder: "Enter GCA above ground",
      description: "Gross rentable area above ground level",
    },
    gcaBelowGround: {
      label: "GCA Below Ground",
      placeholder: "Enter GCA below ground",
      description: "Gross rentable area below ground level",
    },
    capex: {
      label: "Capex",
      placeholder: "Enter the capex",
      description: "Annual capital expenditure required",
    },
    capexPerSqm: {
      label: "Capex/m²",
      placeholder: "Enter capex per sqm",
      description: "Capital expenditure per square meter",
    },
    sale: {
      label: "Sale",
      placeholder: "Enter the sale price",
      description: "Expected or current sale price",
    },
    salePerSqm: {
      label: "Venda/m² ou Exit Yield",
      placeholder: "Enter sale price per sqm",
      description: "Sale price per square meter",
    },
  },
  postNDACard: {
    title: "Post-NDA Information",
    license: {
      label: "License",
      placeholder: "Enter license information",
      description: "Operating or business license details",
    },
    licenseStage: {
      label: "Licensing Stage",
      placeholder: "Enter license stage",
      description: "Current status of licensing process",
    },
    irr: {
      label: "IRR",
      placeholder: "Enter the IRR",
      description: "Internal rate of return",
    },
    coc: {
      label: "Cash-on-Cash Return",
      placeholder: "Enter the CoC",
      description: "Cash-on-cash return percentage",
    },
    holdingPeriod: {
      label: "Hold Period (Years)",
      placeholder: "Enter holding period",
      description: "Expected holding period in years",
    },
    breakEvenOccupancy: {
      label: "Break-Even Occupancy (%)",
      placeholder: "Enter break-even occupancy",
      description: "Occupancy percentage needed to break even",
    },
    vacancyRate: {
      label: "Vacancy Rate (%)",
      placeholder: "Enter vacancy rate",
      description: "Current or expected vacancy rate",
    },
    estimatedRentValue: {
      label: "Estimated Rent Value",
      placeholder: "Enter estimated rent value",
      description: "Estimated annual rental value",
    },
    occupancyRate: {
      label: "Occupancy Rate (%)",
      placeholder: "Enter occupancy rate",
      description: "Current occupancy rate percentage",
    },
    moic: {
      label: "MOIC (Multiple on Invested Capital)",
      placeholder: "Enter the MOIC",
      description: "Total return multiple on invested capital",
    },
    price: {
      label: "Purchase Price",
      placeholder: "Enter purchase price",
      description: "Original or planned purchase price",
    },
    totalInvestment: {
      label: "Total Investment",
      placeholder: "Enter total investment",
      description: "Total capital investment required",
    },
    profitOnCost: {
      label: "Profit on Cost (%)",
      placeholder: "Enter profit on cost",
      description: "Expected profit as percentage of cost",
    },
    profit: {
      label: "Expected Profit",
      placeholder: "Enter expected profit",
      description: "Total expected profit from investment",
    },
    sofCosts: {
      label: "Soft Costs",
      placeholder: "Enter soft costs",
      description: "Professional fees and soft costs",
    },
    sellPerSqm: {
      label: "Sell Price per sqm",
      placeholder: "Enter sell price per sqm",
      description: "Expected resale price per square meter",
    },
    gdv: {
      label: "GDV (Gross Development Value)",
      placeholder: "Enter GDV",
      description: "Total expected project value",
    },
    wault: {
      label: "WAULT (Weighted Average Unexpired Lease Term)",
      placeholder: "Enter WAULT",
      description: "Years of lease term remaining",
    },
    debtServiceCoverageRatio: {
      label: "DSCR (Debt Service Coverage Ratio)",
      placeholder: "Enter DSCR",
      description: "Ratio of income to debt service",
    },
    expectedExitYield: {
      label: "Expected Exit Yield (%)",
      placeholder: "Enter expected exit yield",
      description: "Expected yield at exit",
    },
    ltv: {
      label: "LTV (Loan to Value)",
      placeholder: "Enter LTV (%)",
      description: "Loan amount as percentage of property value",
    },
    ltc: {
      label: "LTC (Loan to Cost)",
      placeholder: "Enter LTC (%)",
      description: "Loan amount as percentage of total cost",
    },
    yieldOnCost: {
      label: "Yield on Cost (%)",
      placeholder: "Enter yield on cost",
      description: "Initial yield on invested capital",
    },
  },
  coInvestmentCard: {
    title: "Co-Investment Information",
    coInvestment: {
      label: "Co-Investment",
      yes: "Yes",
      no: "No",
      description: "Is there co-investment in this opportunity?",
      placeholder: "Select co-investment status",
    },
    gpEquityValue: {
      label: "GP Equity Value",
      placeholder: "Enter GP equity value",
      description: "General partner equity contribution value",
    },
    gpEquityPercentage: {
      label: "GP Equity Percentage (%)",
      placeholder: "Enter GP equity percentage",
      description: "Percentage of equity held by GP",
    },
    totalEquityRequired: {
      label: "Total Equity Required",
      placeholder: "Enter total equity required",
      description: "Total equity capital needed",
    },
    sponsorPresentation: {
      label: "Sponsor Presentation",
      placeholder: "Enter sponsor presentation",
      description: "Sponsor presentation document or link",
    },
    promoteStructure: {
      label: "Promote Structure",
      placeholder: "Enter promote structure",
      description: "Structure of the promote arrangement",
    },
    projectIRR: {
      label: "Project IRR (%)",
      placeholder: "Enter project IRR",
      description: "Expected internal rate of return",
    },
    investorIRR: {
      label: "Investor IRR (%)",
      placeholder: "Enter investor IRR",
      description: "Expected return for co-investors",
    },
    coInvestmentHoldPeriod: {
      label: "Hold Period (Years)",
      placeholder: "Enter hold period",
      description: "Expected holding period for co-investors",
    },
    coInvestmentBreakEvenOccupancy: {
      label: "Break-Even Occupancy (%)",
      placeholder: "Enter break-even occupancy",
      description: "Break-even occupancy percentage for co-investors",
    },
  },
} as const;
