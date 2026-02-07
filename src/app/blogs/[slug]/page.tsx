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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blog.jsonLdSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blog.faqSchema) }}
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
