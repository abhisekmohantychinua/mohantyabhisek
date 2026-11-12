import type { Metadata } from "next";
import type { JSX } from "react";

import ApiDocs from "./api-docs";

export const metadata: Metadata = {
  title: "API Documentation",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ApiDocsPage(): JSX.Element {
  return (
    <div className="container mx-auto overflow-hidden">
      <ApiDocs />
    </div>
  );
}
