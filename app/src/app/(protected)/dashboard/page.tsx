import { headers } from "next/headers";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { auth } from "@/lib/auth";

// Mock data for real estate investments
const mockInvestments = [
  {
    id: 1,
    title: "The Grand Hotel",
    category: "Hospitality - North",
    type: "Hotel",
    location: "North",
    subcategory: "Hospitality",
    image: "/sample-1.png",
    status: "View Investment",
  },
  {
    id: 2,
    title: "Tech Manufacturing Facility",
    category: "Industrial - South",
    type: "Manufacturing",
    location: "South",
    subcategory: "Tech Investment",
    image: "/sample-1.png",
    status: "View Investment",
  },
  {
    id: 3,
    title: "Luxury Apartments",
    category: "Residential - Central",
    type: "Apartments",
    location: "Central",
    subcategory: "Luxury",
    image: "/sample-1.png",
    status: "View Investment",
  },
  {
    id: 4,
    title: "Retail Center",
    category: "Commercial - East",
    type: "Retail",
    location: "East",
    subcategory: "Shopping",
    image: "/sample-1.png",
    status: "View Investment",
  },
  {
    id: 5,
    title: "Office Building",
    category: "Commercial - West",
    type: "Office",
    location: "West",
    subcategory: "Corporate",
    image: "/sample-1.png",
    status: "View Investment",
  },
  {
    id: 6,
    title: "Industrial Warehouse",
    category: "Industrial - North",
    type: "Warehouse",
    location: "North",
    subcategory: "Storage",
    image: "/sample-1.png",
    status: "View Investment",
  },
];

export default async function DashboardIndexPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold mb-6">
            Welcome, {session?.user.name}
          </h1>
        </div>

        {/* Filter Controls */}
        <div className="mb-8 flex gap-4">
          <Select defaultValue="all-types">
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Asset Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-types">Asset Type</SelectItem>
              <SelectItem value="hotel">Hotel</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="apartments">Apartments</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="warehouse">Warehouse</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-locations">
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-locations">Location</SelectItem>
              <SelectItem value="north">North</SelectItem>
              <SelectItem value="south">South</SelectItem>
              <SelectItem value="east">East</SelectItem>
              <SelectItem value="west">West</SelectItem>
              <SelectItem value="central">Central</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-subcategories">
            <SelectTrigger className="w-[200px] bg-white">
              <SelectValue placeholder="Subcategory" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-subcategories">Subcategory</SelectItem>
              <SelectItem value="hospitality">Hospitality</SelectItem>
              <SelectItem value="tech">Tech Investment</SelectItem>
              <SelectItem value="luxury">Luxury</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
              <SelectItem value="storage">Storage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Investment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockInvestments.map((investment) => (
            <Card key={investment.id}>
              <div className="aspect-video relative overflow-hidden -mt-6">
                <div className="absolute inset-0 ">
                  <Image
                    src={investment.image}
                    alt={investment.title}
                    fill
                    className="rounded-lg"
                  />
                </div>
                <div className="relative h-full flex items-end p-4">
                  <div className="text-white text-xs opacity-75">
                    {investment.type} Property
                  </div>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold mb-1">{investment.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {investment.subcategory} • {investment.location}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {investment.type} Investment
                    </p>
                  </div>

                  <Button variant="outline" className="w-full">
                    {investment.status}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" className="px-8">
            Load More Investments
          </Button>
        </div>
      </div>
    </div>
  );
}
