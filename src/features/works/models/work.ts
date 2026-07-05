import type Faq from "@/models/faq";
import type Image from "@/models/image";
import type Metadata from "@/models/metadata";
import type Video from "@/models/video";

interface Work {
  slug: string;

  metadata: Metadata;

  title: string;
  description: string;
  sectors: string[]; // categories
  url: string; // live link

  contents: string[];

  featuredVideo: Video;
  gallery: Array<Image | Video>;

  clients: ProjectAssociate[];
  partners: ProjectAssociate[];
  teamMembers: ProjectAssociate[];
  collaborators: ProjectAssociate[];

  faqs: Faq[];

  postedAt: Date;
  lastModifiedAt: Date;
}
export default Work;

interface ProjectAssociateLink {
  url: string;
  platform: "LinkedIn" | "Website" | "Instagram" | "Behance";
}
interface ProjectAssociate {
  name: string;
  link?: ProjectAssociateLink;
}

export type WorkCard = Pick<Work, "title" | "description" | "slug"> & {
  image: Image;
};
