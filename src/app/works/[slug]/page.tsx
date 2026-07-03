import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { JSX } from "react";

import Hero from "@/features/works/components/hero";
import WorkFaq from "@/features/works/components/work-faqs";
import WorkGallery from "@/features/works/components/work-gallery";
import WorkInfo from "@/features/works/components/work-info";
import type Work from "@/features/works/models/work";
import { works } from "@/features/works/store/works-store";
import type Video from "@/models/video";

const SITE_URL = "https://mohantyabhisek.com";

type WorkPageParams = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function WorkPage({
  params,
}: WorkPageParams): Promise<JSX.Element> {
  const slug = (await params).slug;
  const filteredWorks = works.filter((work) => work.slug === slug);
  if (filteredWorks.length === 0) {
    return notFound();
  }
  const work = filteredWorks[0];

  return (
    <>
      <Hero
        title={work.title}
        description={work.description}
        sectors={work.sectors}
        featuredVideo={work.featuredVideo}
      />
      <WorkInfo
        contents={work.contents}
        clients={work.clients}
        partners={work.partners}
        teamMembers={work.teamMembers}
        collaborators={work.collaborators}
      />
      <WorkGallery gallery={work.gallery} />
      <WorkFaq faqs={work.faqs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(mapToWorkJsonLd(work)),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            mapToVideoJsonLd(work.slug, work.featuredVideo),
          ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(mapToWorkFaqJsonLd(work)),
        }}
      />
    </>
  );
}

export async function generateMetadata({
  params,
}: WorkPageParams): Promise<Metadata> {
  const slug = (await params).slug;

  const work = works.find((work) => work.slug === slug);

  if (!work) {
    return notFound();
  }

  const url = `${SITE_URL}/works/${work.slug}`;

  return {
    title: work.metadata.title,
    description: work.metadata.description,

    authors: [
      {
        name: "Abhisek Mohanty",
        url: SITE_URL,
      },
    ],

    creator: "Abhisek Mohanty",
    publisher: "Abhisek Mohanty",

    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: work.metadata.title,
      description: work.metadata.description,

      url,
      siteName: "Abhisek Mohanty",

      type: "article",

      publishedTime: work.postedAt.toISOString(),
      modifiedTime: work.lastModifiedAt.toISOString(),

      images: [
        {
          url: work.featuredVideo.thumbnail.url,
          width: work.featuredVideo.thumbnail.width,
          height: work.featuredVideo.thumbnail.height,
          alt: work.featuredVideo.thumbnail.alt,
        },
      ],

      videos: [
        {
          url: work.featuredVideo.url,
          width: work.featuredVideo.thumbnail.width,
          height: work.featuredVideo.thumbnail.height,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title: work.metadata.title,
      description: work.metadata.description,

      images: [work.featuredVideo.thumbnail.url],
    },
  };
}

export function mapToWorkJsonLd(work: Work): object {
  const workUrl = `${SITE_URL}/works/${work.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${workUrl}#work`,

    name: work.title,
    description: work.description,

    datePublished: work.postedAt.toISOString(),
    dateModified: work.lastModifiedAt.toISOString(),

    creator: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
    },

    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
    },

    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
    },

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": workUrl,
    },

    about: work.sectors.map((sector) => ({
      "@type": "Thing",
      name: sector,
    })),
  };
}

export function mapToVideoJsonLd(workSlug: string, video: Video): object {
  const workUrl = `${SITE_URL}/works/${workSlug}`;

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${workUrl}#video`,

    name: video.title,
    description: video.description,

    uploadDate: video.uploadedAt.toISOString(),

    duration: `PT${video.duration}S`,

    contentUrl: video.url,

    thumbnail: {
      "@type": "ImageObject",
      url: video.thumbnail.url,
      width: video.thumbnail.width,
      height: video.thumbnail.height,
    },

    isPartOf: {
      "@id": `${workUrl}#work`,
    },

    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

export function mapToWorkFaqJsonLd(work: Work): object {
  const workUrl = `${SITE_URL}/works/${work.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${workUrl}#faq`,

    mainEntity: work.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
