import { blogsData, blogsMetadata } from "@/data/blog-data";
import { notFound } from "next/navigation";
import "./styles.css";
import ScrollProgressBar from "@/components/shared/scroll-progress-bar";

type BlogPageParams = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BlogPage({ params }: BlogPageParams) {
  const slug = (await params).slug;
  const blog = blogsData.filter(
    (blog) => blog.slug.toLowerCase() === slug.toLowerCase(),
  )[0];
  if (!blog) {
    return notFound();
  }

  const rawHtml = blog.content;

  return (
    <>
      <article
        className="blog-wrapper"
        id="blog-wrapper"
        dangerouslySetInnerHTML={{ __html: rawHtml }}
      ></article>
      <ScrollProgressBar
        containerClass="blog-wrapper"
        className="fixed left-1! xl:hidden"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}

export async function generateMetadata({ params }: BlogPageParams) {
  const slug = (await params).slug;
  const metadata = blogsMetadata.filter(
    (blogMeta) => blogMeta.slug.toLowerCase() === slug.toLowerCase(),
  )[0];
  if (!metadata) {
    return notFound();
  }
  return metadata;
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id":
    "https://mohantyabhisek.com/blogs/focused-lead-generation-websites-and-landing-pages#blogposting",
  headline:
    "Focused lead-generation websites and landing pages built for clear decisions",
  description:
    "Learn how focused websites and landing pages reduce friction, clarify intent, and help businesses attract better leads and support confident decisions.",
  datePublished: "2026-02-01",
  dateModified: "2026-02-01",
  author: {
    "@type": "Person",
    "@id": "https://mohantyabhisek.com/#person",
  },
  publisher: {
    "@type": "Organization",
    "@id": "https://mohantyabhisek.com/#organization",
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id":
      "https://mohantyabhisek.com/blogs/focused-lead-generation-websites-and-landing-pages",
  },
  about: [
    {
      "@type": "Thing",
      name: "Lead generation",
    },
    {
      "@type": "Thing",
      name: "Landing pages",
    },
    {
      "@type": "Thing",
      name: "Website and landing page roles",
    },
    {
      "@type": "Thing",
      name: "Small business online presence",
    },
    {
      "@type": "Thing",
      name: "Decision-focused web design",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id":
    "https://mohantyabhisek.com/blogs/focused-lead-generation-websites-and-landing-pages#faq",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a lead?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A lead is a person or business that shows intentional interest in an offer and shares a way to be contacted. A lead exists when intent and accessibility meet.",
      },
    },
    {
      "@type": "Question",
      name: "What is lead generation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Lead generation is the process of attracting the right audience, clarifying the offer, and guiding them toward a deliberate action through a lead generation website.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between a website and a landing page?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A website supports exploration and credibility by explaining who you are and what you do. A landing page supports one specific problem, one offer, and one clear decision.",
      },
    },
    {
      "@type": "Question",
      name: "What does “clear decisions, not noise” mean?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It means structuring a lead generating website so a visitor can make one decision without distraction, unnecessary options, or mixed messages.",
      },
    },
    {
      "@type": "Question",
      name: "When should I use a focused landing page?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A focused landing page makes sense when the offer is clear, intent matters, buyers need reassurance before a conversation, and guidance improves decision-making.",
      },
    },
    {
      "@type": "Question",
      name: "How do landing pages help B2B businesses?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Landing pages support longer sales cycles, improve lead quality, reduce friction before conversations begin, and help filter irrelevant inquiries by setting expectations early.",
      },
    },
    {
      "@type": "Question",
      name: "What affects the cost of a landing page?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Landing page cost is influenced by offer clarity, audience understanding, depth of content thinking, design focus, and integrations such as forms, analytics, and routing.",
      },
    },
    {
      "@type": "Question",
      name: "Which industries benefit most from focused landing pages?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Industries where trust and clarity matter most benefit the most, including real estate, education and coaching, healthcare services, professional services, and B2B software and SaaS.",
      },
    },
  ],
};
