"use client";

import { Lock } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { loginPath } from "@/paths";

export default function HeroContent() {
  return (
    <main className="absolute inset-0 z-20 flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Main Heading - Left Column */}
          <div className="text-left">
            <h1 className="text-2xl md:text-4xl lg:text-6xl xl:text-7xl font-medium text-white leading-[1.2] ">
              YOUR TRUSTED
              <br />
              PARTNER FOR
              <br />
              STRATEGIC GROWTH
            </h1>
          </div>

          {/* Content - Right Column */}
          <div className="text-left space-y-8">
            {/* Description */}
            <p className="text-xl md:text-2xl font-light text-white/80 leading-relaxed max-w-md">
              Harbor Partners is a Lisbon based, Investment Advisory Firm,
              dedicated to providing holistic and integrated services to
              institutional and high net worth individual clients.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-white text-black hover:bg-white/90 px-6 py-3 text-base font-medium rounded-md">
                Request access
              </Button>
              <Link
                href={loginPath()}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "border-white/30 text-white hover:bg-white/10 px-6 py-3 text-base font-medium rounded-md",
                )}
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
}
