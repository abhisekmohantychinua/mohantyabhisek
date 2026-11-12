"use client";

import type { JSX } from "react";
import { useEffect, useState } from "react";

export default function ApiDocs(): JSX.Element | null {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;

    import("rapidoc").then(() => {
      if (active) setReady(true);
    });

    return (): void => {
      active = false;
    };
  }, []);

  if (!ready) return null;

  return (
    <rapi-doc
      spec-url="/openapi.json"
      render-style="read"
      show-header="false"
      allow-try="true"
      allow-authentication="false"
      allow-server-selection="false"
      allow-spec-url-load="false"
      allow-spec-file-load="false"
      allow-spec-file-download="false"
      allow-advanced-search="false"
      nav-item-spacing="default"
      color-scheme="light"
      show-components="true"
    />
  );
}
