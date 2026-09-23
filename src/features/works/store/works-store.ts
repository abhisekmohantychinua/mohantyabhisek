import type Work from "../models/work";
import type { WorkCard } from "../models/work";

export const workCards: WorkCard[] = [
  {
    slug: "iron-core",
    title: "IronCore Fitness",
    description:
      "IronCore's website was built the same way they build strength: one deliberate choice at a time, with nothing left to chance.",
    image: {
      slug: "iron-core-card",
      url: "/works/iron-core/image-1.png",
      alt: "IronCore Fitness hero preview",
      caption: "IronCore Fitness brand preview",
      title: "IronCore Fitness",
      description:
        "A gym brand experience built around clarity, confidence, and disciplined transformation.",
      width: 512,
      height: 384,
    },
  },
];

export const works: Work[] = [
  {
    slug: "iron-core",
    metadata: {
      title: "IronCore Fitness | Case Study",
      description:
        "A premium fitness brand website centered on strength, discipline, and a focused member experience.",
    },
    title: "IronCore Fitness",
    description:
      "IronCore's website was built the same way they build strength: one deliberate choice at a time, with nothing left to chance.",
    sectors: ["Fitness", "Gym", "Strength", "Performance"],
    url: "https://abhisekmohantychinua.github.io/ironcore",
    contents: [
      "IronCore Fitness exists to help people push beyond their limits through structured coaching, quality equipment, and a culture grounded in discipline. The website was developed under real constraints of budget and timeline. The priority was to forge a powerful digital presence that elevates the gym’s visibility and online recognition while staying true to its core philosophy.",
      "The strategy rested on directness. Instead of relying on standard fitness imagery or motivational language, the site positions IronCore as a serious ally in transformation, one where mental resilience matters as much as physical strength. The content follows a thoughtful sequence. It opens with the core idea of “Hustle for Health,” moves through the facilities and coaching approach, and then presents practical information on classes, trainers, and membership options. This progression mirrors how potential members tend to evaluate a gym, understanding the environment and values first, before weighing the details.",
      "Visually, the design draws from the gym’s own character. A dark palette dominated by deep blacks and charcoals, with selective sharp accents, creates an atmosphere of focus and intensity. Typography pairs bold, condensed headlines that carry authority with highly legible text for longer passages. Ample whitespace and careful hierarchy produce a clean, rhythmic layout that echoes the precision expected in serious training. Imagery was chosen to reflect real training environments and equipment favoring credibility over idealized scenes.",
      "Structurally, a single-page format with anchored navigation allows easy movement between sections without losing context. Class schedules, a clear membership comparison table, and trainer profiles are presented in scannable ways. Calls to action are placed where interest is likely to peak, and attention to responsive behavior and contrast ensures the experience works well across devices. These choices were made to reduce obstacles and support informed decisions.",
      "The resulting site gives IronCore a coherent and purposeful online identity. It translates the gym’s values into digital form and provides a direct route from curiosity to commitment.",
    ],
    featuredVideo: {
      slug: "iron-core-featured-video",
      url: "/works/iron-core/video.mp4",
      alt: "IronCore Fitness campaign video",
      caption: "IronCore Fitness brand highlight video",
      transcript:
        "IronCore Fitness brings together performance, discipline, and community through a clear digital experience. The campaign positions the gym as a place for strength, accountability, and visible transformation.",
      title: "IronCore Fitness highlight reel",
      description:
        "Short-form video showcasing the attitude, environment, and energy behind the IronCore brand.",
      thumbnail: {
        slug: "iron-core-video-thumbnail",
        url: "/works/iron-core/image-1.png",
        alt: "IronCore Fitness video thumbnail",
        caption: "IronCore Fitness video thumbnail",
        title: "IronCore Fitness",
        description:
          "A gym brand experience built around clarity, confidence, and disciplined transformation.",
        width: 1440,
        height: 810,
      },
      duration: 60,
      uploadedAt: new Date("2026-09-24T00:00:00.000Z"),
    },
    gallery: [
      {
        slug: "iron-core-gallery-1",
        url: "/works/iron-core/image-1.png",
        alt: "IronCore Fitness exterior and brand aesthetic",
        caption: "IronCore Fitness brand and visual tone",
        title: "IronCore Fitness visual identity",
        description:
          "Brand-first imagery used to reinforce strength, discipline, and clarity.",
        width: 1440,
        height: 810,
      },
      {
        slug: "iron-core-gallery-2",
        url: "/works/iron-core/image-2.png",
        alt: "IronCore Fitness gym interior",
        caption: "Training floor and premium equipment environment",
        title: "IronCore Fitness interior",
        description:
          "Gym environment designed to communicate quality, performance, and focus.",
        width: 1440,
        height: 810,
      },
      {
        slug: "iron-core-gallery-3",
        url: "/works/iron-core/image-3.png",
        alt: "IronCore Fitness coaching experience",
        caption: "Structured coaching and member experience",
        title: "IronCore Fitness coaching",
        description:
          "A clear coaching framework and member journey built into the brand story.",
        width: 1440,
        height: 810,
      },
      {
        slug: "iron-core-gallery-4",
        url: "/works/iron-core/image-4.png",
        alt: "IronCore Fitness class and transformation messaging",
        caption: "Transformation-led content and class messaging",
        title: "IronCore Fitness transformation",
        description:
          "Conversion-focused communication built around results and discipline.",
        width: 1440,
        height: 810,
      },
      {
        slug: "iron-core-gallery-5",
        url: "/works/iron-core/image-5.png",
        alt: "IronCore Fitness membership and call-to-action layout",
        caption: "Membership presentation and engagement-led UI",
        title: "IronCore Fitness membership layout",
        description:
          "Clear pricing and action-driven layouts that reduce friction for potential members.",
        width: 1440,
        height: 810,
      },
    ],
    clients: [{ name: "IronCore Fitness" }],
    partners: [],
    teamMembers: [],
    collaborators: [],
    faqs: [
      {
        question: "What was the main goal behind the IronCore Fitness website?",
        answer:
          "The core goal was to create a digital presence that communicated strength, discipline, and trust while making it easier for people to discover the gym and take action.",
      },
      {
        question: "How did the design reflect the brand?",
        answer:
          "The brand used a dark, high-contrast visual system with strong typography and concise content to mirror the intensity and discipline of the training environment.",
      },
      {
        question: "Why was the site structured as a single-page experience?",
        answer:
          "A single-page flow supported effortless navigation, quick scanning, and a clear path from brand story to membership conversion without unnecessary friction.",
      },
    ],
    postedAt: new Date("2026-09-24T00:00:00.000Z"),
    lastModifiedAt: new Date("2026-09-24T00:00:00.000Z"),
  },
];
