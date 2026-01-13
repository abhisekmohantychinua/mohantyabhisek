"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollControl() {
  const [visible, setVisible] = useState(true);

  const onScrollDown = () => {
    const problemSection = document.getElementById("problem-section");
    if (problemSection) {
      problemSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    const heroSection = document.getElementById("hero-section");
    if (!heroSection) return;

    const heroHeight = heroSection.offsetHeight;

    const handleScroll = () => {
      setVisible(window.scrollY < heroHeight);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // run once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="scroll-control" onClick={onScrollDown}>
      <p className="scroll-text">Scroll Down</p>
      <ChevronDown className="scroll-icon" size={24} />
    </div>
  );
}
