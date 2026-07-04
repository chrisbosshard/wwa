import React from "react";
import Link from "next/link";

const Hero = ({ title = null, subtitle = null }) => {
  return (
    <section className="caritas-hero">
      <div className="caritas-hero-inner">
        <Link href="/" className="caritas-hero-logo">
          <img src="/WWA_Logo_gelb.png" alt="Weihnachtswunschaktion" />
        </Link>
        {title && <h1 className="caritas-hero-title">{title}</h1>}
        {subtitle && <p className="caritas-hero-subtitle">{subtitle}</p>}
      </div>
    </section>
  );
};

export default Hero;
