import React from 'react'
import Link from "next/link"
import Style from "./About.module.css"
const About = () => {
  const about=[
    {
      name:"About",
      link:"about"
    },
    {
      name:"Contact us",
      link:"contact-us"
    }
  ]
  return (
    <div className={Style.box}>
      <div key={0} className={Style.about}>
        <Link href={{pathname:'/about'}} legacyBehavior>
        <a><p>About</p></a>
        </Link>
      </div>
      <div key={1} className={Style.about}>
        <Link href={{pathname:'/contact-us'}} legacyBehavior>
        <a><p>Contact us</p></a>
        </Link>
      </div>
    </div>
  )
}

export default About