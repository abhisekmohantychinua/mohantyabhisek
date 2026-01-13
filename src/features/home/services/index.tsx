import Image from "next/image";
import "./styles.css";
import ServicesContentAnimator from "./services-content-animator";
import ServicesCardAnimator from "./services-card-animator";

type ServiceCard = {
  title: string;
  image: string;
  lines: string[];
};

const services: ServiceCard[] = [
  {
    title: "A presence people trust quickly",
    image: "/services/landing.webp",
    lines: [
      "People understand what you do in seconds",
      "Your business looks credible, not improvised",
      "Enquiries feel intentional, not random",
    ],
  },
  {
    title: "A product users don’t struggle with",
    image: "/services/saas.webp",
    lines: [
      "Users know what to do without being taught",
      "Features support decisions, not confusion",
      "The product feels stable as it grows",
    ],
  },
  {
    title: "Systems that save real time",
    image: "/services/dashboard.webp",
    lines: [
      "Daily work takes fewer steps",
      "Repetition reduces across teams",
      "Time goes back into running the business",
    ],
  },
];

export default function Services() {
  return (
    <section className="services-section" aria-labelledby="services-heading">
      <div className="services-content">
        <p className="services-kicker">Solutions</p>

        <h2 id="services-heading" className="services-heading">
          Find your way
        </h2>

        <p className="services-intro">Different goals, clear outcomes.</p>

        <div
          className="services-grid"
          role="list"
          aria-label="Service options framed as situations"
        >
          {services.map((service) => {
            return (
              <article
                key={service.title}
                className="services-card"
                role="listitem"
                tabIndex={0}
                aria-label={`${service.title}`}
              >
                <h3 className="services-title">{service.title}</h3>
                <figure className="services-image">
                  <Image
                    src={service.image}
                    alt=""
                    width={400}
                    height={250}
                    loading="lazy"
                  />
                </figure>

                <div className="services-lines">
                  {service.lines.map((line) => (
                    <p key={line} className="services-line">
                      {line}
                    </p>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <ServicesContentAnimator />
      <ServicesCardAnimator />
    </section>
  );
}
