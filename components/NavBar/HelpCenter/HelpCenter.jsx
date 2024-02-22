import React from 'react'
import Link from "next/link"
//internal link
import Style from "./HelpCenter.module.css"
const HelpCenter = () => {
  const helpCenter=[
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
     {helpCenter.map((el , i)=>(
      <div className={Style.helpCenter}>
        <Link href={{pathname:`${el.link}`}}>
        <a><p>{el.name}</p></a>
        </Link>
      </div>
     ))}
    </div>
  )
}

export default HelpCenter