import { Metadata } from "next";

export default interface Blog {
  slug: string;
  postedAt: Date;
  jsonLdSchema: object;
  faqSchema: object;
  content: string;
}
export interface BlogMetadata extends Metadata {
  slug: string;
  postedAt: Date;
}
