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
      title: "IronCore Fitness Website | Abhisek",
      description:
        "Explore the IronCore Fitness website project, designed and developed to present the gym's brand, services, classes, trainers, and membership options through a focused digital experience.",
    },
    title: "IronCore Fitness",
    description:
      "IronCore's website was built the same way they build strength: one deliberate choice at a time, with nothing left to chance.",
    sectors: ["Business Website", "Service Business"],
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
      alt: "IronCore Fitness website showcase featuring its homepage, classes, membership plans, trainers, and member testimonials.",
      caption:
        "IronCore Fitness website walkthrough showcasing the brand, services, membership plans, trainers, and testimonials.",
      transcript:
        "The video opens with a Google search for IronCore Fitness before transitioning into the IronCore website. The homepage introduces IronCore with the message “Hustle for Health” and highlights strength, discipline, results, structured coaching, equipment, and community. The About section presents IronCore's philosophy, state-of-the-art equipment, and expert coaches. The Classes and Training section presents different training options designed to build strength, burn calories, and improve flexibility. The Membership Plans section presents Starter, Pro, and Elite membership options with different levels of access, training, coaching, and community support. The video then showcases trainer profiles and the member experience before displaying testimonials from IronCore members. It concludes with the IronCore Fitness logo and brand identity.",
      title: "IronCore Fitness Website Showcase",
      description:
        "A visual walkthrough of the IronCore Fitness website, showcasing its brand identity, fitness philosophy, class and training information, membership plans, trainer profiles, and member testimonials.",
      thumbnail: {
        slug: "iron-core-video-thumbnail",
        url: "/works/iron-core/image-1.png",
        alt: "IronCore Fitness website visual featuring its gym branding, strength-focused imagery, and fitness messaging.",
        caption: "IronCore Fitness brand and website experience.",
        title: "IronCore Fitness Website Preview",
        description:
          "A visual preview of the IronCore Fitness website combining its bold brand identity, gym environment, and strength-focused messaging.",
        width: 1440,
        height: 810,
      },
      duration: 39,
      uploadedAt: new Date("2026-09-24T00:00:00.000Z"),
    },
    gallery: [
      {
        slug: "iron-core-gallery-1",
        url: "/works/iron-core/image-1.png",
        alt: "IronCore Fitness website displayed across desktop screens with its dark gym-focused design and orange visual identity.",
        caption: "IronCore Fitness website across desktop layouts.",
        title: "IronCore Fitness Desktop Website Design",
        description:
          "A desktop presentation of the IronCore Fitness website, showcasing its dark visual system, orange accents, fitness imagery, navigation, content sections, and membership-focused interface.",
        width: 1440,
        height: 810,
      },
      {
        slug: "iron-core-gallery-2",
        url: "/works/iron-core/image-2.png",
        alt: "IronCore Fitness website showing the homepage, membership plans, and trainer sections in a dark orange interface.",
        caption: "Website interface and membership experience.",
        title: "IronCore Fitness Website And Membership Pages",
        description:
          "A closer look at the IronCore Fitness website across its homepage and membership experience, showing how the visual identity, service information, pricing plans, trainers, and supporting content are presented together.",
        width: 1440,
        height: 810,
      },
      {
        slug: "iron-core-gallery-3",
        url: "/works/iron-core/image-3.png",
        alt: 'IronCore Fitness website presentation with layered desktop screens and the message "Build Your Best Self."',
        caption: "Brand messaging and website presentation.",
        title: "IronCore Fitness Brand And Website Presentation",
        description:
          "A promotional composition combining multiple IronCore Fitness website screens with the brand's visual identity and messaging, highlighting the connection between the fitness brand and its digital experience.",
        width: 1440,
        height: 810,
      },
      {
        slug: "iron-core-gallery-4",
        url: "/works/iron-core/image-4.png",
        alt: "IronCore Fitness website shown across three mobile screens with fitness content, classes, and membership information.",
        caption: "Responsive mobile website experience.",
        title: "IronCore Fitness Mobile Website Design",
        description:
          "The responsive mobile experience for IronCore Fitness, showing how the website's content, navigation, classes, and membership information adapt to smaller screens while maintaining the same visual identity.",
        width: 1440,
        height: 810,
      },
      {
        slug: "iron-core-gallery-5",
        url: "/works/iron-core/image-5.png",
        alt: "IronCore Fitness website shown on a desktop monitor and tablet with responsive layouts for classes and membership content.",
        caption: "Responsive website across desktop and tablet layouts.",
        title: "IronCore Fitness Responsive Website",
        description:
          "A responsive presentation of the IronCore Fitness website across larger screen sizes, showing the homepage alongside classes and membership content and demonstrating how the interface adapts across devices.",
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
        question: "What was the main goal of the IronCore Fitness website?",
        answer:
          "The main goal was to create a strong digital presence that improved IronCore Fitness's online visibility while communicating its core values of strength, discipline, and transformation. The website was designed to give potential members a clear understanding of the gym, its approach, and its offerings before taking action.",
      },
      {
        question: "How was the website content structured?",
        answer:
          "The content follows a deliberate progression, beginning with IronCore's philosophy and positioning before moving into its facilities, coaching approach, classes, trainers, and membership options. This structure helps visitors understand the environment and values first, then evaluate the practical details.",
      },
      {
        question:
          "How did the website design reflect the IronCore Fitness brand?",
        answer:
          "The design uses deep blacks and charcoals with sharp accent colors to create a focused and intense visual atmosphere. Bold condensed typography establishes authority, while clear body text, whitespace, and structured layouts keep the experience easy to scan.",
      },
      {
        question: "Why was the website designed as a single-page experience?",
        answer:
          "The single-page structure allows visitors to move between the major sections through anchored navigation without losing context. It keeps the gym's story, facilities, classes, trainers, and membership information within one continuous experience.",
      },
      {
        question: "How were classes and membership options presented?",
        answer:
          "Classes, training information, and membership plans were organized into scannable sections so visitors could understand the available options without working through unnecessary navigation. The membership comparison presents the available plans and their features in a clear format.",
      },
      {
        question: "How was the website designed for different devices?",
        answer:
          "Responsive behavior was considered throughout the experience so that the site's content, navigation, imagery, and calls to action remain usable across different screen sizes. Contrast and layout hierarchy were also maintained to keep important information accessible on smaller screens.",
      },
      {
        question: "What influenced the visual direction of the website?",
        answer:
          "The visual direction was drawn from IronCore's own training environment, equipment, and brand character. Imagery focuses on real training settings and equipment rather than idealized fitness scenes, helping the digital experience remain connected to the character of the gym.",
      },
    ],
    postedAt: new Date("2026-09-24T00:00:00.000Z"),
    lastModifiedAt: new Date("2026-09-24T00:00:00.000Z"),
  },
];
