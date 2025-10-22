import { Header } from "@/components/index/header";
import { Hero } from "@/components/index/hero";
import { ShaderBackground } from "@/components/index/shader-background";

const IndexPage = () => (
  <ShaderBackground>
    <Header />
    <Hero />
  </ShaderBackground>
);

export { IndexPage };
