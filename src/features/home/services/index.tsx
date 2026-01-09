import "./styles.css";

type ServiceCard = {
  label: string;
  title: string;
  lines: string[];
  outcomes: string[];
};

const services: ServiceCard[] = [
  {
    label: "WHEN YOU NEED CLARITY FAST",
    title: "Landing Page / Simple Website",
    lines: [
      "You already have a service.",
      "You need people to understand it quickly.",
      "And trust it enough to contact you.",
    ],
    outcomes: ["Clear message.", "Simple structure.", "No unnecessary pages."],
  },
  {
    label: "WHEN YOU ARE BUILDING A PRODUCT",
    title: "SaaS / Custom Web App",
    lines: [
      "The idea exists.",
      "Decisions are still forming.",
      "Structure matters more than speed.",
    ],
    outcomes: ["Thoughtful flows.", "Practical systems.", "Room to grow."],
  },
  {
    label: "WHEN OPERATIONS ARE COSTING TIME",
    title: "ERP / CRM / Management System",
    lines: [
      "Work is repeating.",
      "Information is scattered.",
      "Decisions take longer than they should.",
    ],
    outcomes: [
      "Less friction.",
      "Clear workflows.",
      "Time saved across teams.",
    ],
  },
];

export default function Services() {
  return (
    <section className="services-section" aria-labelledby="services-heading">
      <div className="services-content">
        <p className="services-kicker">Services</p>

        <h2 id="services-heading" className="services-heading">
          Different problems need different systems.
        </h2>

        <p className="services-intro">
          I don&apos;t start with services.
          <br />I start with the situation.
        </p>

        <div
          className="services-grid"
          role="list"
          aria-label="Service options framed as situations"
        >
          {services.map((service, index) => {
            const delay = 0.18 + index * 0.12;
            return (
              <article
                key={service.title}
                className="services-card"
                role="listitem"
                style={{ animationDelay: `${delay}s` }}
                tabIndex={0}
                aria-label={`${service.title} — ${service.label}`}
              >
                <p className="services-label">{service.label}</p>
                <h3 className="services-title">{service.title}</h3>
                <div className="services-lines">
                  {service.lines.map((line) => (
                    <p key={line} className="services-line">
                      {line}
                    </p>
                  ))}
                </div>
                <div
                  className="services-outcomes"
                  aria-label="Expected outcomes"
                >
                  {service.outcomes.map((outcome) => (
                    <p key={outcome} className="services-outcome">
                      {outcome}
                    </p>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <p className="services-closing">
          Choosing the wrong system is expensive.
          <br />
          Taking time to decide is not.
        </p>
      </div>
    </section>
  );
}
