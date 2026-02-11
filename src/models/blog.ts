export default interface Blog {
  slug: string;
  title: string;
  description: string;
  content: string;
  topics: string[];
  faqs: Faq[];
  postedAt: Date;
  lastModifiedAt: Date;
}

export interface Faq {
  question: string;
  answer: string;
}

export type BlogCard = Pick<
  Blog,
  "slug" | "title" | "description" | "postedAt"
>;

export type BlogSitemap = Pick<Blog, "slug" | "lastModifiedAt">;
