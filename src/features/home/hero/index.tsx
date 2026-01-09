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
          I help businesses decide what they actually need before building
          anything.
        </h1>

        {/* Supporting statement - introduces problem → insight without blame */}
        <p className="hero-support hero-animate-support">
          Most projects fail because clarity comes too late.
          <br />I focus on structure first.
        </p>

        {/* Context line - grounds abstract thinking and clarifies scope */}
        <p className="hero-context hero-animate-context">
          Websites, SaaS products, and internal systems.
          <br />
          Built with purpose, not noise.
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

        {/* Screen reader descriptions for CTAs */}
        <div className="sr-only">
          <p id="primary-cta-description">
            Begin a discussion about your project needs and structure
          </p>
          <p id="secondary-cta-description">
            Learn about the process and methodology for project clarity
          </p>
        </div>
      </div>

      {/* Optional subtle background shape - hidden by default */}
      <div
        className="hero-background-shape"
        aria-hidden="true"
        role="presentation"
      >
        {/* Future: Very subtle abstract shape with <6% opacity */}
      </div>
    </section>
  );
}
