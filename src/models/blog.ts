import { Metadata } from "next";

export default interface Blog {
  slug: string;
  content: string;
  postedAt: Date;
}
export interface BlogMetadata extends Metadata {
  slug: string;
  postedAt: Date;
}
