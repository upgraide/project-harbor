/**
 * CAGR (Compound Annual Growth Rate) Calculator
 *
 * Calculates Sales CAGR and EBITDA CAGR from graph data.
 *
 * Rules:
 * - Returns null if there are fewer than 3 rows of data
 * - Uses only the most recent 5 years if more than 5 years exist
 * - Uses only first and last year values (ignores intermediate years)
 * - Formula: CAGR = (Value_end / Value_start)^(1/n) - 1
 */

interface GraphRow {
  year: string;
  revenue: number;
  ebitda: number;
  ebitdaMargin: number;
}

interface CAGRResult {
  salesCAGR: number | null;
  ebitdaCAGR: number | null;
}

/**
 * Calculate both Sales CAGR and EBITDA CAGR from graph rows
 *
 * @param graphRows Array of yearly financial data
 * @returns Object with salesCAGR and ebitdaCAGR (null if <3 rows)
 */
export function calculateCAGR(graphRows: GraphRow[]): CAGRResult {
  // Return null for both if fewer than 3 rows
  if (!graphRows || graphRows.length < 3) {
    return { salesCAGR: null, ebitdaCAGR: null };
  }

  // Sort by year (ascending) to ensure correct ordering
  const sortedRows = [...graphRows].sort((a, b) =>
    a.year.localeCompare(b.year)
  );

  // Take only the most recent 5 years if more than 5 exist
  const relevantRows =
    sortedRows.length > 5 ? sortedRows.slice(-5) : sortedRows;

  // Get first and last year data
  const firstYear = relevantRows[0];
  const lastYear = relevantRows[relevantRows.length - 1];

  // Calculate n (number of years between start and end)
  const n = Number.parseInt(lastYear.year) - Number.parseInt(firstYear.year);

  // Prevent division by zero or invalid calculations
  if (n <= 0) {
    return { salesCAGR: null, ebitdaCAGR: null };
  }

  // Calculate Sales CAGR
  // Formula: (Sales_end / Sales_start)^(1/n) - 1
  let salesCAGR: number | null = null;
  if (firstYear.revenue > 0 && lastYear.revenue > 0) {
    salesCAGR = (lastYear.revenue / firstYear.revenue) ** (1 / n) - 1;
    // Convert to percentage and round to 2 decimal places
    salesCAGR = Math.round(salesCAGR * 10_000) / 100;
  }

  // Calculate EBITDA CAGR
  // Formula: (EBITDA_end / EBITDA_start)^(1/n) - 1
  let ebitdaCAGR: number | null = null;
  if (firstYear.ebitda > 0 && lastYear.ebitda > 0) {
    ebitdaCAGR = (lastYear.ebitda / firstYear.ebitda) ** (1 / n) - 1;
    // Convert to percentage and round to 2 decimal places
    ebitdaCAGR = Math.round(ebitdaCAGR * 10_000) / 100;
  }

  return { salesCAGR, ebitdaCAGR };
}
