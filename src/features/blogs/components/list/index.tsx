"use client";

import "./styles.css";

import type { JSX } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import BlogCardSkeleton from "@/features/blogs/components/blog-card-skeleton";
import type { BlogCard as BlogCardType } from "@/features/blogs/models/blog";
import type PageResponse from "@/models/page-response";

import { fetchBlogCardsPage } from "../../services/blog-api-service";
import BlogCard from "../blog-card";

type BlogListProps = {
  initialResponse: PageResponse<BlogCardType>;
  query: string | undefined;
};

export default function BlogList({
  initialResponse,
  query,
}: BlogListProps): JSX.Element {
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

  const loadNextPage = useCallback((): void => {
    if (loadingRef.current || isLastIndex) {
      return;
    }
    loadingRef.current = true;

    setLoading(true);

    const nextIndex = currentIndex + 1;

    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    fetchBlogCardsPage(nextIndex, abortController.signal, normalizedQuery)
      .then((response) => {
        setBlogs((currentBlogs) => [...currentBlogs, ...response.items]);
        setCurrentIndex(response.currentIndex);
        setIsLastIndex(response.isLastIndex);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Failed to load next blog page", error);
      })
      .finally(() => {
        loadingRef.current = false;
        setLoading(false);
      });
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

    return (): void => {
      observer.disconnect();
    };
  }, [loadNextPage, isLastIndex]);

  useEffect(() => {
    return (): void => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return (
    <section className="blog-list__section" aria-labelledby="blog-list-heading">
      <h2 className="blog-list__heading" id="blog-list-heading">
        {normalizedQuery
          ? `Search results for "${normalizedQuery}"`
          : "Read our latest Blogs"}
      </h2>

      {blogs.length === 0 ? (
        <p className="blog-list__empty">No blogs found.</p>
      ) : (
        <>
          <div className="blog-list__grid">
            {blogs.map((blogCard) => (
              <BlogCard key={blogCard.slug} blogCard={blogCard} />
            ))}

            {loading &&
              Array.from({ length: 3 }).map((_, index) => (
                <BlogCardSkeleton key={`blog-card__loading-${index}`} />
              ))}
          </div>

          {!isLastIndex && (
            <div
              ref={observerRef}
              className="blog-list__scroll-anchor"
              aria-hidden="true"
            />
          )}
        </>
      )}
    </section>
  );
}
