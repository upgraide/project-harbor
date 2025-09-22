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
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";

interface MergerAndAcquisitionsOpportunityCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  createdAt: number;
}

const MergerAndAcquisitionsOpportunityCard = ({
  id,
  name,
  description,
  image,
  createdAt,
}: MergerAndAcquisitionsOpportunityCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <Image src={image} alt={name} width={100} height={100} />
        <span className="ml-auto shrink-0 text-muted-foreground text-xs">
          Created {formatDistanceToNow(createdAt)}
        </span>
      </CardContent>

      <CardFooter>
        <Link
          href={dashboardMergersAndAcquisitionOpportunityPath(id)}
          className={cn(buttonVariants({ size: "lg" }), "w-full")}
        >
          View Opportunity
        </Link>
      </CardFooter>
    </Card>
  );
};

export default MergerAndAcquisitionsOpportunityCard;
