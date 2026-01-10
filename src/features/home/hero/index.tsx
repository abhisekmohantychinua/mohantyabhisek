import { Button } from "@/components/ui/button";
import "./styles.css";

/**
 * Hero Section Component
 *
 * Purpose: Establish how we think and set expectations for the rest of the page
 * Design Philosophy: Create quiet authority in under 5 seconds
 *
 * Key Behaviors:
 * - Slows the user down rather than exciting them
 * - Feels like opening the first page of a consultant's notebook
 * - Invites conversation, not conversion
 * - No selling or explaining everything
 */
export default function Hero() {
  return (
    <section
      className="hero-section"
      role="banner"
      aria-labelledby="hero-headline"
    >
      {/* Content container with intentional narrow width to force intention */}
      <div className="hero-content">
        {/* Primary headline - establishes core value proposition */}
        <h1 id="hero-headline" className="hero-headline hero-animate-headline">
          Start with clarity. <br /> Build with purpose.
        </h1>

        {/* Supporting statement - process that provides quality */}
        <p className="hero-support hero-animate-support">
          Work begins by understanding the problem in its full context. This
          makes it easier to see what actually needs to be built, and what does
          not. With that understanding in place, solutions are defined before
          any execution starts. Structure keeps the work focused and reduces
          unnecessary complexity. The same approach applies to websites, SaaS
          products, and internal systems. Each is designed for reliable,
          practical use over time.
        </p>

        {/* CTA area - inviting, not urgent */}
        <div className="hero-cta-area hero-animate-cta">
          {/* Primary CTA - conversation starter */}
          <Button
            variant="accent"
            size="lg"
            className="font-sans"
            type="button"
            aria-describedby="primary-cta-description"
          >
            Start a conversation
          </Button>

          {/* Secondary CTA - low-commitment option to reduce friction */}
          <Button
            variant="ghost"
            size="default"
            className="hero-cta-secondary"
            type="button"
            aria-describedby="secondary-cta-description"
          >
            See how I work
          </Button>
        </div>
      </div>
    </section>
  );
}
