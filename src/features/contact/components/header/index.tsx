import "./styles.css";

import type { JSX } from "react";

export default function Header(): JSX.Element {
  return (
    <div className="header">
      <h1 id="header__heading" className="header__heading">
        Reach Out In A Way <br /> That <span className="highlight">Works</span>{" "}
        For You
      </h1>
      <p className="header__description">
        Whether you prefer email, messaging, social platforms, or a direct call,
        you can choose the contact method that feels most convenient. Each
        option below connects you directly with me, so you can reach out in the
        way that works best for you.
      </p>
    </div>
  );
}
