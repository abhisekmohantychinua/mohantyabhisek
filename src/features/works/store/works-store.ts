import type Work from "../models/work";
import type { WorkCard } from "../models/work";

const mockWorkCard: WorkCard = {
  title: "Premium Portfolio Website",
  description:
    "A minimal portfolio website focused on storytelling, motion, and performance.",
  slug: "premium-portfolio-website",
  image: {
    slug: "portfolio-cover",
    url: "/work-image.jpg",
    alt: "Portfolio website homepage",
    caption: "Homepage hero section",
    title: "Portfolio Cover",
    description: "Cover image for the portfolio case study",
    width: 1600,
    height: 900,
  },
};

export const workCards: WorkCard[] = Array.from({ length: 8 }, (_, index) => ({
  ...mockWorkCard,
  slug: `premium-portfolio-website-${index + 1}`,
  title: `Premium Portfolio Website ${index + 1}`,
}));

const mockWork: Work = {
  slug: "premium-portfolio-website",

  metadata: {
    title: "Premium Portfolio Website",
    description:
      "A modern portfolio website focused on storytelling, performance, and conversions.",
  },

  title: "Premium Portfolio Website",
  description:
    "A minimal portfolio website focused on storytelling, motion, and performance.",

  sectors: ["Portfolio", "Personal Brand"],

  url: "https://example.com",

  contents: [
    "Imperial College London is one of the world’s top-ten universities, specialising in the areas of science, engineering, medicine and business. Widely known as ‘Imperial’, it’s a multidisciplinary hub for education, research, translation and commercialisation, addressing global challenges through science and innovation.",
    "Despite its reputation, Imperial felt it could do more to communicate the excellent work that the university does. Imperial’s visual identity was designed in the 1990s and never had a fully developed brand proposition, which led to a disjointed approach and a lack of consistent guiding principles. This in turn affected the effectiveness of its communications, marketing and fundraising work.",
    "To address this, Pentagram was hired to develop a cohesive brand proposition to enhance Imperial’s global presence. Imperial recognised that buy-in and active support would be essential to the success of this project; it required careful stakeholder management, supported by measurable benefits across student recruitment, communications, outreach, marketing and fundraising.",
    "Imperial’s new brand identity includes a new brand strategy (created by Simple Revolution), brand narrative and tone of voice (created by Pentagram’s Brand Narrative team), as well as a logo, a bespoke variable typeface, colour palette and a set of icons. The design team also produced a comprehensive set of brand guidelines, social assets, signage, merchandise and stationery.",
  ],

  featuredVideo: {
    slug: "portfolio-showcase-video",
    url: "/work-video.mp4",
    alt: "Portfolio website walkthrough",
    caption: "Project showcase video",
    transcript: "A walkthrough of the portfolio website project.",
    title: "Portfolio Showcase",
    description: "Video presentation of the completed portfolio website.",
    duration: 120,
    thumbnail: {
      slug: "portfolio-video-thumbnail",
      url: "/work-image.jpg",
      alt: "Portfolio video thumbnail",
      caption: "Video thumbnail",
      title: "Portfolio Video Thumbnail",
      description: "Thumbnail for portfolio showcase video.",
      width: 1600,
      height: 900,
    },
    uploadedAt: new Date(),
  },

  gallery: [
    {
      slug: "portfolio-homepage",
      url: "/images/portfolio-homepage.jpg",
      alt: "Portfolio homepage",
      caption: "Homepage design",
      title: "Homepage",
      description: "Hero section and introduction.",
      width: 1600,
      height: 900,
    },
    {
      slug: "portfolio-projects",
      url: "/images/portfolio-projects.jpg",
      alt: "Projects section",
      caption: "Projects showcase",
      title: "Projects Section",
      description: "Selected works and case studies.",
      width: 1600,
      height: 900,
    },
  ],

  clients: [
    {
      name: "John Doe",
      link: {
        url: "https://linkedin.com/in/johndoe",
        platform: "LinkedIn",
      },
    },
  ],

  partners: [
    {
      name: "Creative Studio",
      link: {
        url: "https://creativestudio.com",
        platform: "Website",
      },
    },
  ],

  teamMembers: [
    {
      name: "Abhisek",
      link: {
        url: "https://linkedin.com/in/abhisek",
        platform: "LinkedIn",
      },
    },
  ],

  collaborators: [
    {
      name: "Jane Smith",
      link: {
        url: "https://instagram.com/janesmith",
        platform: "Instagram",
      },
    },
  ],

  faqs: [
    {
      question: "What was the project timeline?",
      answer: "The project was completed in approximately 4 weeks.",
    },
    {
      question: "What technologies were used?",
      answer:
        "The project was built using React, TypeScript, and Tailwind CSS.",
    },
  ],

  postedAt: new Date("2025-01-15"),
  lastModifiedAt: new Date("2025-01-20"),
};

export const works: Work[] = Array.from({ length: 8 }, (_, index) => ({
  ...mockWork,

  slug: `premium-portfolio-website-${index + 1}`,

  title: `Premium Portfolio Website ${index + 1}`,

  description: `Case study for Premium Portfolio Website ${
    index + 1
  }, showcasing design, development, and performance optimization.`,

  url: `https://example.com/work/${index + 1}`,

  sectors:
    index % 2 === 0 ? ["Portfolio", "Personal Brand"] : ["SaaS", "Technology"],

  postedAt: new Date(2025, index, 1),
  lastModifiedAt: new Date(2025, index, 15),

  featuredVideo: {
    ...mockWork.featuredVideo,
    slug: `portfolio-showcase-video-${index + 1}`,
  },
}));
