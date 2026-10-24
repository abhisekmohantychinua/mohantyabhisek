import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import BlogCategoryPosts from ".";

describe("BlogCategoryPosts", () => {
  test("renders the category's blog cards", () => {
    render(
      <BlogCategoryPosts
        categoryTitle="Web Development"
        blogs={[
          {
            slug: "website-guide",
            title: "A Website Guide",
            description: "A guide for websites.",
            postedAt: new Date("2026-02-01"),
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Blogs in Web Development" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "A Website Guide", level: 3 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /A Website Guide/ }),
    ).toHaveAttribute("href", "/blogs/website-guide");
  });

  test("shows an empty state when the category has no blogs", () => {
    render(<BlogCategoryPosts categoryTitle="Web Development" blogs={[]} />);

    expect(
      screen.getByText("No blogs are available in this category yet."),
    ).toBeInTheDocument();
  });
});
