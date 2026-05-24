"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import BlogCardComponent from "@/components/shared/blog-card";
import BlogCardSkeleton from "@/components/shared/blog-card-skeleton";
import { BlogCard } from "@/models/blog";
import PageResponse from "@/models/page-response";

import "./styles.css";

type BlogListClientProps = {
  initialResponse: PageResponse<BlogCard>;
  query: string | undefined;
};

export default function BlogListClient({
  initialResponse,
  query,
}: BlogListClientProps) {
  const normalizedQuery = query?.trim() || undefined;

  const [blogs, setBlogs] = useState(initialResponse.items);

  const [currentIndex, setCurrentIndex] = useState(
    initialResponse.currentIndex,
  );

  const [isLastIndex, setIsLastIndex] = useState(initialResponse.isLastIndex);

  const [loading, setLoading] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadingRef = useRef(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const loadNextPage = useCallback(async () => {
    if (loadingRef.current || isLastIndex) {
      return;
    }

    loadingRef.current = true;

    setLoading(true);

    const nextIndex = currentIndex + 1;

    abortControllerRef.current?.abort();

    const abortController = new AbortController();

    abortControllerRef.current = abortController;

    try {
      const searchParams = new URLSearchParams();

      searchParams.set("index", String(nextIndex));

      if (normalizedQuery) {
        searchParams.set("query", normalizedQuery);
      }

      const response = await fetch(`/api/blogs?${searchParams.toString()}`, {
        signal: abortController.signal,
      });

      if (!response.ok) {
        return;
      }

      const data: PageResponse<BlogCard> = await response.json();

      setBlogs((currentBlogs) => [...currentBlogs, ...data.items]);

      setCurrentIndex(data.currentIndex);

      setIsLastIndex(data.isLastIndex);
    } catch (error) {
      /**
       * Ignore aborted requests.
       */
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      console.error("Failed to load next blog page", error);
    } finally {
      loadingRef.current = false;

      setLoading(false);
    }
  }, [currentIndex, isLastIndex, normalizedQuery]);

  useEffect(() => {
    const element = observerRef.current;

    if (!element || isLastIndex) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      if (!entry?.isIntersecting) {
        return;
      }

      loadNextPage();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [loadNextPage, isLastIndex]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return (
    <section className="blog-list-section" aria-labelledby="blog-list-heading">
      <h2 className="blog-list-heading" id="blog-list-heading">
        {normalizedQuery
          ? `Search results for "${normalizedQuery}"`
          : "Read our latest Blogs"}
      </h2>

      {blogs.length === 0 ? (
        <p className="blog-list-empty">No blogs found.</p>
      ) : (
        <>
          <div className="blog-list-grid">
            {blogs.map((blogCard) => (
              <BlogCardComponent key={blogCard.slug} blogCard={blogCard} />
            ))}

            {loading &&
              Array.from({ length: 3 }).map((_, index) => (
                <BlogCardSkeleton key={`blog-card-loading-${index}`} />
              ))}
          </div>

          {!isLastIndex && (
            <div
              ref={observerRef}
              className="blog-list-scroll-anchor"
              aria-hidden="true"
            />
          )}
        </>
      )}
    </section>
  );
}
