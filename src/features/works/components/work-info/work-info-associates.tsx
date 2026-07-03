import Link from "next/link";
import type { JSX } from "react";

import type Work from "../../models/work";

type WorkInfoAssociatesProps = Pick<
  Work,
  "clients" | "partners" | "teamMembers" | "collaborators"
>;

export default function WorkInfoAssociates({
  clients,
  partners,
  teamMembers,
  collaborators,
}: WorkInfoAssociatesProps): JSX.Element {
  const sections = [
    { title: "Client", items: clients },
    { title: "Partner", items: partners },
    { title: "Team Member", items: teamMembers },
    { title: "Collaborator", items: collaborators },
  ];

  return (
    <div className="work-info__associates">
      <h3 className="sr-only">Project Associates</h3>

      <div className="work-info__associates-grid">
        {sections.map(
          ({ title, items }) =>
            items.length > 0 && (
              <div className="work-info__associates-grid-item" key={title}>
                <h3 className="work-info__associates-title">
                  {items.length === 1 ? title : `${title}s`}
                </h3>

                {items.map((item) =>
                  item.link ? (
                    <Link
                      key={item.name}
                      href={item.link.url}
                      target="_blank"
                      className="work-info__associate-link"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <p key={item.name} className="work-info__associate-name">
                      {item.name}
                    </p>
                  ),
                )}
              </div>
            ),
        )}
      </div>
    </div>
  );
}
