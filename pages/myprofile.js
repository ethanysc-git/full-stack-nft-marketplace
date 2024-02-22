import React from "react";
import { HeroSection, Service } from "../components/componentindex";
import HomeStyle from "../styles/index.module.css";
import Style from "../components/HeroSection/HeroSection.module.css";
//
function MyProfile() {
  return (
    <div className={HomeStyle.homePage}>
      <div className={Style.heroSection}>
        <h1>My Profile</h1>
      </div>
    </div>
  );
}

export default MyProfile;
