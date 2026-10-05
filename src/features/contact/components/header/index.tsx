import "./styles.css";

import type { JSX } from "react";

export default function Header(): JSX.Element {
  return (
    <div className="header">
      <h1 id="header__heading" className="header__heading">
        Ways To <span className="highlight">Reach Me</span>
      </h1>
      <p className="header__description">
        Choose the contact method that works best for you. You can reach me
        directly through WhatsApp, email, phone, LinkedIn, or Instagram.
      </p>
    </div>
  );
}
