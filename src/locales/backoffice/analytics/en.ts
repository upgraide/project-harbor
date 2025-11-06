export default {
  title: "Analytics",
  description: "View the top performing opportunities",
  loadingMessage: "Loading analytics...",
  errorMessage: "Failed to load analytics. Please try again.",
  noData: "No analytics data available yet",
  chart: {
    title: "Top 5 Opportunities by Views",
    totalViews: "total views",
    views: "Views",
  },
  kpis: {
    aum: "Total Assets Under Management (AUM)",
    assetsTransacted: "Total Assets Transacted",
    mandatesClosedYTD: "Total Mandates Closed (Deals) Year-to-Date (YTD)",
    activeClients: "Active Clients",
    newClientsQuarter: "New Clients this quarter",
  },
  graphs: {
    sectionTitle: "2. Key Graphs & Visualizations (Middle Section)",
    assetsTransacted: {
      title: "Assets Transacted Growth Over Time",
      yLabel: "Total Assets Transacted",
    },
    aum: {
      title: "AUM Growth Over Time",
      yLabel: "Total AUM",
    },
    pipeline: {
      title: "Deal Pipeline Funnel",
      stages: {
        leads: "Leads",
        dueDiligence: "Due Diligence",
        negotiation: "Negotiation",
        closed: "Closed",
      },
    },
    segmentation: {
      title: "Client Segmentation",
      valueLabel: "Clients",
    },
    sector: {
      title: "Revenue Breakdown by Sector",
      yLabel: "Count",
    },
  },
};
