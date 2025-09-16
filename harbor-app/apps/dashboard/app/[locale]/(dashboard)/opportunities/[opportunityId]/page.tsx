"use client";

import { api } from "@harbor-app/backend/convex/_generated/api";
import type { Id } from "@harbor-app/backend/convex/_generated/dataModel";
import { Badge } from "@harbor-app/ui/components/badge";
import { Button } from "@harbor-app/ui/components/button";
import { Card, CardContent } from "@harbor-app/ui/components/card";
import { Separator } from "@harbor-app/ui/components/separator";
import { useQuery } from "convex/react";
import { use } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface OpportunityPageProps {
  params: Promise<{
    opportunityId: Id<"opportunitiesMergersAndAcquisitions">;
  }>;
}

// Sample financial data for charts
const revenueData = [
  { year: "2021", value: 15.2 },
  { year: "2022", value: 16.8 },
  { year: "2023", value: 18.3 },
  { year: "2024 (Est.)", value: 19.1 },
];

const ebitdaData = [
  { year: "2021", value: 2.8 },
  { year: "2022", value: 3.1 },
  { year: "2023", value: 3.3 },
  { year: "2024 (Est.)", value: 3.5 },
];

export default function OpportunityPage({ params }: OpportunityPageProps) {
  const { opportunityId } = use(params);
  const opportunity = useQuery(api.public.opportunities.getOpportunityById, {
    opportunityId,
  });

  if (!opportunity) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading opportunity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {opportunity.name}
          </h1>
          <p className="text-muted-foreground mb-3">
            {opportunity.industry} •{" "}
            {opportunity.subIndustry || opportunity.type}
          </p>
          <div className="flex items-center gap-3">
            <Badge
              className="capitalize"
              variant={
                opportunity.status === "interested"
                  ? "default"
                  : opportunity.status === "completed"
                    ? "secondary"
                    : "outline"
              }
            >
              {opportunity.status.replace("-", " ")}
            </Badge>
            <Badge className="bg-background" variant="outline">
              {opportunity.type} • {opportunity.typeDetails}
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Sales Range</p>
          <p className="text-2xl font-bold text-foreground">
            €{opportunity.sales}M
          </p>
        </div>
      </div>

      {/* Hero Image and Thumbnails */}
      <div className="space-y-6">
        <div className="relative h-80 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 rounded-xl overflow-hidden border border-border">
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6">
            <h2 className="text-xl font-semibold text-foreground">
              Investment Overview
            </h2>
            <p className="text-muted-foreground">
              Premium {opportunity.industry.toLowerCase()} opportunity
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="relative h-28 bg-muted/50 rounded-lg overflow-hidden border border-border hover:border-primary/20 transition-colors">
            <div className="absolute bottom-3 left-3 text-xs font-medium text-foreground bg-background/90 backdrop-blur-sm px-2 py-1 rounded">
              Manufacturing Facility
            </div>
          </div>
          <div className="relative h-28 bg-muted/50 rounded-lg overflow-hidden border border-border hover:border-primary/20 transition-colors">
            <div className="absolute bottom-3 left-3 text-xs font-medium text-foreground bg-background/90 backdrop-blur-sm px-2 py-1 rounded">
              Production Line
            </div>
          </div>
          <div className="relative h-28 bg-muted/50 rounded-lg overflow-hidden border border-border hover:border-primary/20 transition-colors">
            <div className="absolute bottom-3 left-3 text-xs font-medium text-foreground bg-background/90 backdrop-blur-sm px-2 py-1 rounded">
              Warehouse
            </div>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <Card className="border-border">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">
            Project Overview
          </h2>
          <p className="text-muted-foreground leading-relaxed text-lg">
            {opportunity.description ||
              `This project involves an investment in a leading ${opportunity.industry.toLowerCase()} company located in Northern Portugal. The company specializes in producing high-quality components for various industries, including automotive, construction, and consumer goods. With a strong track record of growth and profitability, the company is seeking capital to expand its production capacity and enter new markets.`}
          </p>
        </CardContent>
      </Card>

      {/* Financial Indicators */}
      <Card className="border-border">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-8 text-foreground">
            Financial Indicators
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Revenue Chart */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Revenue
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">
                    €18.3M
                  </span>
                  <span className="text-sm text-muted-foreground">
                    2021-2024 (Est.)
                  </span>
                </div>
              </div>
              <div className="h-40">
                <ResponsiveContainer height="100%" width="100%">
                  <LineChart data={revenueData}>
                    <XAxis
                      axisLine={false}
                      dataKey="year"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Line
                      dataKey="value"
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      stroke="#3b82f6"
                      strokeWidth={2}
                      type="monotone"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* EBITDA Chart */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  EBITDA
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">
                    €3.3M
                  </span>
                  <span className="text-sm text-muted-foreground">
                    2021-2024 (Est.)
                  </span>
                </div>
              </div>
              <div className="h-40">
                <ResponsiveContainer height="100%" width="100%">
                  <LineChart data={ebitdaData}>
                    <XAxis
                      axisLine={false}
                      dataKey="year"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Line
                      dataKey="value"
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      stroke="#3b82f6"
                      strokeWidth={2}
                      type="monotone"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          {/* Financial Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-4 rounded-lg bg-muted/20 border border-border">
              <p className="text-sm text-muted-foreground mb-2">
                2024 EBITDA Margin
              </p>
              <p className="text-2xl font-bold text-foreground">18%</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/20 border border-border">
              <p className="text-sm text-muted-foreground mb-2">CAGR</p>
              <p className="text-2xl font-bold text-foreground">14%</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/20 border border-border">
              <p className="text-sm text-muted-foreground mb-2">Sales Range</p>
              <p className="text-2xl font-bold text-foreground">
                €{opportunity.sales}M
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/20 border border-border">
              <p className="text-sm text-muted-foreground mb-2">EBITDA Range</p>
              <p className="text-2xl font-bold text-foreground">
                €{opportunity.ebitda}M
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Information */}
      <Card className="border-border">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-8 text-foreground">
            Investment Information
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground font-medium">
                  Equity Value
                </span>
                <span className="font-semibold text-foreground text-lg">
                  €9.5M
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground font-medium">
                  Enterprise Value
                </span>
                <span className="font-semibold text-foreground text-lg">
                  €12.3M
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground font-medium">
                  Net Debt
                </span>
                <span className="font-semibold text-foreground text-lg">
                  €2.7M
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-muted-foreground font-medium">
                  % Available
                </span>
                <span className="font-semibold text-foreground text-lg">
                  25%
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground font-medium">
                  Investment Amount
                </span>
                <span className="font-semibold text-foreground text-lg">
                  €1.5M
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground font-medium">
                  Minimum Ticket
                </span>
                <span className="font-semibold text-foreground text-lg">
                  €250,000
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground font-medium">
                  Operation Type
                </span>
                <span className="font-semibold text-foreground text-lg">
                  {opportunity.type}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-muted-foreground font-medium">
                  Industry
                </span>
                <span className="font-semibold text-foreground text-lg">
                  {opportunity.industry}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shareholder Structure */}
      <Card className="border-border">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-8 text-foreground">
            Shareholder Structure
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left py-4 text-muted-foreground font-semibold text-sm uppercase tracking-wider">
                    Shareholder
                  </th>
                  <th className="text-center py-4 text-muted-foreground font-semibold text-sm uppercase tracking-wider">
                    Pre-Investment
                  </th>
                  <th className="text-center py-4 text-muted-foreground font-semibold text-sm uppercase tracking-wider">
                    Post-Investment
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="py-4 font-medium text-foreground">Founders</td>
                  <td className="py-4 text-center font-semibold text-foreground">
                    60%
                  </td>
                  <td className="py-4 text-center font-semibold text-foreground">
                    45%
                  </td>
                </tr>
                <tr className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="py-4 font-medium text-foreground">
                    Management
                  </td>
                  <td className="py-4 text-center font-semibold text-foreground">
                    20%
                  </td>
                  <td className="py-4 text-center font-semibold text-foreground">
                    15%
                  </td>
                </tr>
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="py-4 font-medium text-foreground">
                    Investors
                  </td>
                  <td className="py-4 text-center font-semibold text-foreground">
                    20%
                  </td>
                  <td className="py-4 text-center font-semibold text-foreground">
                    40%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
        <Button
          className="px-8 py-3 font-medium border-2 hover:bg-muted/50 transition-all duration-200"
          size="lg"
          variant="outline"
        >
          Explore Documents
        </Button>
        <Button
          className="px-8 py-3 font-medium bg-green-600 hover:bg-green-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
        >
          Interested to Invest
        </Button>
        <Button
          className="px-8 py-3 font-medium bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl"
          size="lg"
          variant="default"
        >
          Co-Invest
        </Button>
      </div>
    </div>
  );
}
