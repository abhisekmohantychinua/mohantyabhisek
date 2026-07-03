import { notFound } from "next/navigation";
import type { JSX } from "react";

import Hero from "@/features/works/components/hero";
import WorkInfo from "@/features/works/components/work-info";
import { works } from "@/features/works/store/works-store";

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
    </>
  );
}
