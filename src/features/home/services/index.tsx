import Image from "next/image";
import "./styles.css";
import ServicesContentAnimator from "./services-content-animator";
import ServicesCardAnimator from "./services-card-animator";

type ServiceCard = {
  title: string;
  subTitle: string;
  image: string;
  description: string;
};

const services: ServiceCard[] = [
  {
    subTitle: "A presence people trust quickly",
    title: "Landing pages, Business websites",
    image: "/services/landing.webp",
    description:
      "People understand what you do within seconds of arriving. Your business feels credible and considered, not improvised. Enquiries come from the right context, not confusion.",
  },
  {
    subTitle: "A product users don’t struggle with",
    title: "SaaS products, Custom web apps",
    image: "/services/saas.webp",
    description:
      "Users know what to do without being guided step by step. Features support decisions instead of adding friction. The product stays stable as it grows and changes.",
  },
  {
    subTitle: "Systems that save real time",
    title: "ERP, CRM, Management systems",
    image: "/services/dashboard.webp",
    description:
      "Daily work takes fewer steps and less manual effort. Repetition reduces across teams as systems take over. Time goes back into running the business, not managing chaos.",
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
                <figure className="services-image">
                  <Image
                    src={service.image}
                    alt=""
                    width={400}
                    height={250}
                    loading="lazy"
                  />
                </figure>
                <p className="services-subtitle">{service.subTitle}</p>
                <h3 className="services-title">{service.title}</h3>
                <p className="services-outcome">{service.description}</p>
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
