import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import BlogCategoryList from ".";

describe("BlogCategoryList", () => {
  test("renders a card for each category", () => {
    render(
      <BlogCategoryList
        categories={[
          {
            slug: "web-development",
            title: "Web Development",
            description: "Articles about web development.",
            createdAt: new Date("2026-01-01T00:00:00.000Z"),
            lastModifiedAt: new Date("2026-06-15T00:00:00.000Z"),
          },
          {
            slug: "business-systems",
            title: "Business Systems",
            description: "Articles about business systems.",
            createdAt: new Date("2026-01-01T00:00:00.000Z"),
            lastModifiedAt: new Date("2026-06-10T00:00:00.000Z"),
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Browse blog categories" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Web Development", level: 3 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Business Systems", level: 3 }),
    ).toBeInTheDocument();
  });

  test("shows an empty state when there are no categories", () => {
    render(<BlogCategoryList categories={[]} />);

    expect(
      screen.getByText("No blog categories are available yet."),
    ).toBeInTheDocument();
  });
});
