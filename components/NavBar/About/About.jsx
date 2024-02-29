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
      name:"Contact us ",
      link:"contact-us"
    }
  ]
  return (
    <div className={Style.box}>
     {about.map((el , i)=>(
      <div key={i+1} className={Style.about}>
        <Link href={{pathname:`${el.link}`}} legacyBehavior>
        <a><p>{el.name}</p></a>
        </Link>
      </div>
     ))}
    </div>
  )
}

export default About