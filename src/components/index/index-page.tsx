import { Header } from "@/components/index/header";
import { Hero } from "@/components/index/hero";
import { ShaderBackground } from "@/components/index/shader-background";

const IndexPage = () => (
  <div className="min-h-screen w-full">
    <ShaderBackground>
      <Header />
      <Hero />
    </ShaderBackground>
  </div>
);

export { IndexPage };
