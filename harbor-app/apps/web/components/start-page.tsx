import Header from "@/components/header";
import { Hero } from "@/components/hero";
import ShaderBackground from "@/components/shader-background";

export function StartPage() {
  return (
    <ShaderBackground>
      <Header />
      <Hero />
    </ShaderBackground>
  );
}
