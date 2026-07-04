import "./styles.css";

import type { JSX } from "react";

import type { WorkCard as WorkCardType } from "../../models/work";
import WorkCard from "../work-card";

type WorkListProps = {
  workCards: WorkCardType[];
};

export default function WorkList({ workCards }: WorkListProps): JSX.Element {
  return (
    <section className="work-list__section" aria-labelledby="work-list-heading">
      <h2 className="work-list__heading" id="work-list-heading">
        More Projects And Case Studies
      </h2>

      {workCards.length === 0 ? (
        <p className="work-list__empty">No case studies found.</p>
      ) : (
        <>
          <div className="work-list__grid">
            {workCards.map((workCard) => (
              <WorkCard key={workCard.slug} workCard={workCard} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
