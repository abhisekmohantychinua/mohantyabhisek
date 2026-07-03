import { notFound } from "next/navigation";
import type { JSX } from "react";

import WorkInfo from "@/features/works/components/work-info";
import WorkTop from "@/features/works/components/work-top";
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
      <WorkTop
        title={work.title}
        description={work.description}
        sectors={work.sectors}
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
