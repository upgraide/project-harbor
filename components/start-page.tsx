import { Hero } from "@/components/hero";
import { Header } from "./header";
import { ShaderBackground } from "./shader-background";

export const StartPage = () => (
  <ShaderBackground>
    <Header />
    <Hero />
  </ShaderBackground>
);
