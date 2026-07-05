import type { JSX } from "react";

import type Work from "../../models/work";

type WorkFaqProps = Pick<Work, "faqs">;

export default function WorkFaq({ faqs }: WorkFaqProps): JSX.Element {
  return (
    <section className="work-faq sr-only">
      <h2>FAQs</h2>
      <dl>
        {faqs.map((faq, index) => (
          <>
            <dt key={index}>{faq.question}</dt>
            <dd>{faq.answer}</dd>
          </>
        ))}
      </dl>
    </section>
  );
}
