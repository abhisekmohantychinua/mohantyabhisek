import Faq from "@/models/faq";
import Image from "@/models/image";
import Metadata from "@/models/metadata";
import Video from "@/models/video";

interface Work {
  slug: string;

  metadta: Metadata;

  title: string;
  description: string;
  sectors: string[]; // categories
  url: string; // live link

  content: string[];

  featuredVideo: Video;
  galery: Array<Image | Video>;

  client?: ProjectAssociate;
  partners?: ProjectAssociate;
  team?: ProjectAssociate;
  collaborators?: ProjectAssociate;

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
