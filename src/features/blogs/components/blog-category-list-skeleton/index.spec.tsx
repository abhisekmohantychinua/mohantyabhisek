import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import BlogCategoryListSkeleton from ".";

describe("BlogCategoryListSkeleton", () => {
  test("renders the requested number of category-card placeholders", () => {
    const { container } = render(<BlogCategoryListSkeleton count={3} />);

    expect(
      container.querySelectorAll(".blog-category-card-skeleton"),
    ).toHaveLength(3);
  });
});
