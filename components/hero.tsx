import { Button, buttonVariants } from "@/components/ui/button";
import { Lock } from "lucide-react";
import Link from "next/link";
import { signInPath } from "@/lib/paths";

export const Hero = () => {
  return (
    <main className="absolute inset-0 z-20 flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="text-left">
            <h1 className="text-2xl md:text-4xl lg:text-6xl xl:text-7xl text-white font-medium leading-[1.2] ">
              YOUR TRUSTED
              <br />
              PARTNER FOR
              <br />
              STRATEGIC GROWTH
            </h1>
          </div>

          <div className="text-left space-y-8">
            <p className="text-xl md:text-2xl font-light text-white/80 leading-relaxed max-w-md">
              Harbor Partners is a Lisbon based, Investment Advisory Firm,
              dedicated to providing holistic and integrated services to
              institutional and high net worth individual clients.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size={"lg"} variant={"default"}>
                Request access
              </Button>
              <Link
                className={buttonVariants({ variant: "outline", size: "lg" })}
                href={signInPath()}
              >
                <Lock className="size-4 mr-2" />
                Membership login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
