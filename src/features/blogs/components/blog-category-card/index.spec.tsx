import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import BlogCategoryCard from ".";

describe("BlogCategoryCard", () => {
  test("shows category details and links to its page", () => {
    render(
      <BlogCategoryCard
        blogCategory={{
          slug: "web-development",
          title: "Web Development",
          description: "Articles about building websites and web applications.",
          createdAt: new Date("2026-01-01T00:00:00.000Z"),
          lastModifiedAt: new Date("2026-06-15T00:00:00.000Z"),
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Web Development", level: 3 }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Articles about building websites and web applications.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Updated")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Web Development/ }),
    ).toHaveAttribute("href", "/blogs/categories/web-development");
  });
});
