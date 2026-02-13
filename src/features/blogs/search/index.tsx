import { Input } from "@/components/ui/input";
import "./styles.css";

type BlogSearchProps = {
  query: string | undefined;
};
export default function BlogSearch({ query }: BlogSearchProps) {
  return (
    <section className="blog-search-section" aria-labelledby="search-heading">
      <h2 id="search-heading" className="sr-only">
        Search Blogs
      </h2>
      <form className="blog-search-form" method="get" action="/blogs">
        <label htmlFor="blog-search-input" className="sr-only">
          Search blogs
        </label>
        <Input
          id="blog-search-input"
          type="text"
          name="q"
          placeholder="Search blogs..."
          defaultValue={query || ""}
          className="blog-search-input"
        />
      </form>
    </section>
  );
}
