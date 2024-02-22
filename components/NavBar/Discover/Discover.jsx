import React from 'react'
import Link from "next/link"
import Style from "./Discover.module.css"



const Discover = () => {
const discover=[
 {
  name : "Collection",
  link: "collection"
 },
 {
  name : "Search",
  link: "search"
 }
]

  return (
    <div>{discover.map((el,i)=>(
      <div key={i+1} className={Style.discover}>
        <Link href={{pathname:`${el.link}`}} > {el.name}</Link>
      </div> 
    ))}</div>
  )
}

export default Discover