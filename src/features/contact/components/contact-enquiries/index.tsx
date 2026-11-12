import "./styles.css";

import type { JSX } from "react";

export default async function ContactEnquiries(): Promise<JSX.Element> {
  return (
    <section className="contact-enquiries">
      <span className="contact-enquiries__kicker kicker">
        Project Enquiries
      </span>
      <h2 className="contact-enquiries__heading">
        Let&apos;s Talk About What You&apos;re{" "}
        <span className="highlight">Building</span>
      </h2>
      <p className="contact-enquiries__description">
        You can reach out whether you&apos;re planning a new website,
        considering a custom web application, improving an existing digital
        product, or exploring a business system for your team. You don&apos;t
        need to have everything planned before getting in touch, a brief
        description of what you&apos;re working on is enough to start the
        conversation.
      </p>
      <p className="contact-enquiries__description">
        For project enquiries, email or WhatsApp are the most direct options.
        LinkedIn, Telegram, and Instagram are also available if you&apos;d
        prefer to connect there first.
      </p>
    </section>
  );
}
