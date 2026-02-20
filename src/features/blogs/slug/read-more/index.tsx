import BlogCardComponent from "@/components/shared/blog-card";
import { getLatestThreeBlogCardsExceptSlug } from "@/services/blog-service";
import "./styles.css";

type ReadMoreProps = {
  slug: string;
};

export default async function ReadMore({ slug }: ReadMoreProps) {
  const latestBlogs = await getLatestThreeBlogCardsExceptSlug(slug);

  if (latestBlogs.length === 0) {
    return null; // Don't render the section if there are no blogs to show
  }

  return (
    <section className="read-more-section" aria-labelledby="read-more-heading">
      <h3 className="read-more-heading">Read More</h3>
      <div className="read-more-grid">
        {latestBlogs.map((blog) => (
          <BlogCardComponent key={blog.slug} blogCard={blog} />
        ))}
      </div>
    </section>
  );
}
