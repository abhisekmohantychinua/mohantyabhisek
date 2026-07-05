import { Plus } from "lucide-react";
import type { JSX } from "react";

import { Button } from "@/components/ui/button";

export default function WorkInfoCollapsibleActionButton(): JSX.Element {
  return (
    <Button variant="ghost" size="lg" className="work-info__collapsible-action">
      About the Project
      <span
        aria-hidden="true"
        className="work-info__collapsible-action-icon-wrapper"
      >
        <Plus className="work-info__collapsible-action-icon" />
      </span>
    </Button>
  );
}
