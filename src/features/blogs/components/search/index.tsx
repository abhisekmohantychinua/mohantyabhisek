import "./styles.css";

import type { JSX } from "react";

import { Input } from "@/components/ui/input";

type BlogSearchProps = {
  query: string | undefined;
};
export default function BlogSearch({
  query,
}: BlogSearchProps): JSX.Element | null {
  return (
    <section className="blog-search__section" aria-labelledby="search-heading">
      <h2 id="search-heading" className="sr-only">
        Search Blogs
      </h2>
      <form className="blog-search__form" method="get" action="/blogs">
        <label htmlFor="blog-search__input" className="sr-only">
          Search blogs
        </label>
        <Input
          id="blog-search-input"
          type="text"
          name="q"
          placeholder="Search blogs..."
          defaultValue={query || ""}
          className="blog-search__input"
        />
      </form>
    </section>
  );
}
