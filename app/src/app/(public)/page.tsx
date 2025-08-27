import Header from "./_components/header";
import HeroContent from "./_components/hero-content";
import ShaderBackground from "./_components/shader-background";

export default function Page() {
  return (
    <ShaderBackground>
      <Header />
      <HeroContent />
    </ShaderBackground>
  );
}
