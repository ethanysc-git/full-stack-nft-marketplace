import React from 'react'
import Link from "next/link"
import Style from "./About.module.css"
const About = () => {
  return (
    <div className={Style.box}>
      <div key={0} className={Style.about}>
        <Link href="/about-login"  legacyBehavior>
        <a><p>About Login</p></a>
        </Link>
      </div>
      <div key={1} className={Style.about}>
        <Link href="/about-create"  legacyBehavior>
        <a><p>About Create</p></a>
        </Link>
      </div>
      <div key={0} className={Style.about}>
        <Link href="/about-marketplace"  legacyBehavior>
        <a><p>About Marketplace</p></a>
        </Link>
      </div>
    </div>
  )
}

export default About