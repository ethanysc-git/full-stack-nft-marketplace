import React from "react";
import { HeroSection, Service } from "../components/componentindex";
//import HomeStyle from "../styles/index.module.css";
import Style from "../components/HeroSection/HeroSection.module.css";
//
function About() {
  return (
    <div>
      <div className={Style.heroSection}>
        <h1>About</h1>
      </div>
    </div>
  );
}

export default About;
