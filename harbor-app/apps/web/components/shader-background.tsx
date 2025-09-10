"use client";

import { MeshGradient } from "@paper-design/shaders-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

interface ShaderBackgroundProps {
  children: React.ReactNode;
}

export default function ShaderBackground({ children }: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [_, setIsActive] = useState(false);

  useEffect(() => {
    const handleMouseEnter = () => setIsActive(true);
    const handleMouseLeave = () => setIsActive(false);

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" ref={containerRef}>
      <svg className="absolute inset-0 w-0 h-0">
        <title>Filters</title>
        <defs>
          <filter height="200%" width="200%" x="-50%" y="-50%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix
              result="tint"
              type="matrix"
              values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
            />
          </filter>
          <filter height="200%" width="200%" x="-50%" y="-50%">
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="4" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              result="gooey"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Background Shaders */}
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={["#11112D", "#3b82f6", "#ffffff", "#1e40af", "#60a5fa"]}
        speed={0.3}
      />
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-60"
        colors={["#11112D", "#ffffff", "#3b82f6", "#11112D"]}
        speed={0.2}
      />

      {children}
    </div>
  );
}
