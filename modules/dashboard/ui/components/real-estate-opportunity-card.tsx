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
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>

        {description && description !== name && (
          <CardDescription>
            <div className="mt-1 flex items-center justify-between gap-2">
              <div className="flex w-0 grow items-center gap-1">
                <span className="line-clamp-3 text-muted-foreground">
                  {description}
                </span>
              </div>
            </div>
          </CardDescription>
        )}
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
          <span>Created {formatDistanceToNow(createdAt)} ago</span>
        </div>
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

export default RealEstateOpportunityCard;
