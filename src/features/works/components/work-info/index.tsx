import "./styles.css";

import { Plus } from "lucide-react";
import type { JSX } from "react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import type Work from "../../models/work";
import WorkInfoAssociates from "./work-info-associates";
import WorkInfoCollapsibleActionButton from "./work-info-collapsible-action-button";
import WorkInfoContents from "./work-info-contents";

type WorkInfoProps = Pick<
  Work,
  "contents" | "clients" | "partners" | "teamMembers" | "collaborators"
>;

export default function WorkInfo({
  contents,
  clients,
  partners,
  teamMembers,
  collaborators,
}: WorkInfoProps): JSX.Element {
  return (
    <section className="work-info">
      <Collapsible className="work-info__collapsible">
        <div className="work-info__header">
          <h2 className="work-info__heading">
            Complete Project <span className="highlight">Information</span>
          </h2>
          <CollapsibleTrigger asChild>
            <WorkInfoCollapsibleActionButton />
          </CollapsibleTrigger>
        </div>

        <hr className="divider work-info__divider" />

        <CollapsibleContent>
          <WorkInfoContents contents={contents} />
          <WorkInfoAssociates
            clients={clients}
            partners={partners}
            teamMembers={teamMembers}
            collaborators={collaborators}
          />
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}
