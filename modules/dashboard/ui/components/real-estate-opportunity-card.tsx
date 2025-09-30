"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dashboardRealEstateOpportunityPath } from "@/lib/paths";
import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";

interface RealEstateOpportunityCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: number;
}

const RealEstateOpportunityCard = ({
  id,
  name,
  description,
  image,
  createdAt,
}: RealEstateOpportunityCardProps) => {
  const t = useScopedI18n("dashboardCard");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>

        <CardDescription>
          <div className="mt-1 flex items-center justify-between gap-2 min-h-14">
            <div className="flex w-0 grow items-center gap-1">
              <span className="line-clamp-3 text-muted-foreground">
                {description}
              </span>
            </div>
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Image
          src={image}
          alt={name}
          width={400}
          height={300}
          className="w-full h-48 object-cover rounded-md"
        />
        <div className="ml-auto shrink-0 text-muted-foreground text-xs mt-2">
          <span>
            {t("createdAt")} {formatDistanceToNow(createdAt)} {t("ago")}
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Link
          href={dashboardRealEstateOpportunityPath(id)}
          className={cn(buttonVariants({ size: "lg" }), "w-full")}
        >
          {t("viewOpportunity")}
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RealEstateOpportunityCard;
