"use client";

import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dashboardMergersAndAcquisitionOpportunityPath } from "@/lib/paths";
import { cn } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";

type MergerAndAcquisitionsOpportunityCardProps = {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: number;
};

const MergerAndAcquisitionsOpportunityCard = ({
  id,
  name,
  description,
  image,
  createdAt,
}: MergerAndAcquisitionsOpportunityCardProps) => {
  const t = useScopedI18n("dashboardCard");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>

        <CardDescription>
          <div className="mt-1 flex min-h-14 items-center justify-between gap-2">
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
          alt={"Opportunity Image"}
          className="h-48 w-full rounded-md object-cover"
          height={300}
          src={image}
          width={400}
        />
        <div className="mt-2 ml-auto shrink-0 text-muted-foreground text-xs">
          <span>
            {t("createdAt")} {formatDistanceToNow(createdAt)} {t("ago")}
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Link
          className={cn(buttonVariants({ size: "lg" }), "w-full")}
          href={dashboardMergersAndAcquisitionOpportunityPath(id)}
        >
          {t("viewOpportunity")}
        </Link>
      </CardFooter>
    </Card>
  );
};

export default MergerAndAcquisitionsOpportunityCard;
