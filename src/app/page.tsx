import Hero from "@/features/home/hero";
import Problem from "@/features/home/problem";
import Thinking from "@/features/home/thinking";
import Services from "@/features/home/services";
import Cta from "@/features/home/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <Thinking />
      <Services />
      <Cta />
    </>
  );
}
