"use client";

import FuzzyText from "@/components/FuzzyText";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container mx-auto min-h-screen flex flex-col justify-center items-center gap-6">
      <FuzzyText
        baseIntensity={0.07}
        hoverIntensity={0.2}
        fuzzRange={15}
        fps={30}
        glitchMode
        color="var(--foreground)"
      >
        404
      </FuzzyText>
      <FuzzyText
        baseIntensity={0.03}
        hoverIntensity={0.1}
        fuzzRange={8}
        fps={30}
        color="#2b2b2b"
        fontSize="clamp(1.5rem, 5vw, 2.5rem)"
      >
        Oops! Page Not Found
      </FuzzyText>
      <p className="max-w-md text-foreground/60">
        The page you are looking for does not exist. It might have been moved or
        deleted.
      </p>
      <Button variant="outline" className="mt-4" asChild>
        <Link href="/">Go to Home</Link>
      </Button>
    </section>
  );
}
