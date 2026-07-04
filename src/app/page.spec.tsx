import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Home from "./page";

describe("Home Page", () => {
  test("should display all homepage sections", () => {
    const { container } = render(<Home />);

    expect(container.querySelector("section.hero")).toBeDefined();
    expect(container.querySelector("section.about-us")).toBeDefined();
    expect(container.querySelector("section.solutions")).toBeDefined();
    expect(container.querySelector("section.testimonials")).toBeDefined();
    expect(container.querySelector("section.blogs")).toBeDefined();
  });
});
