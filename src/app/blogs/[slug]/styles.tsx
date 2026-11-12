"use client";

import type { JSX } from "react";
import { useEffect } from "react";

export default function Styles(): JSX.Element | null {
  useEffect(() => {
    initialize();
  }, []);

  return null;
}

/**
 * Initializer function which initializes the scripts for the blog page.
 */
function initialize(): void {
  wrapTableOnOverflow();
}

/**
 * Wraps tables in a div with class "table-wrapper" if they overflow the blog wrapper.
 */
function wrapTableOnOverflow(): void {
  const blog = document.querySelector(".blog-wrapper");

  if (!blog) return;

  blog.querySelectorAll("table").forEach((table) => {
    if (table.closest(".table-wrapper")) return;

    if (table.scrollWidth > blog.clientWidth) {
      const wrapper = document.createElement("div");

      wrapper.className = "table-wrapper";

      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    }
  });
}
