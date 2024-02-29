import React from 'react'
import Link from "next/link"
import Style from "./Discover.module.css"



const Discover = () => {
const discover=[
  {
    name : "Home",
    link: "/"
   },
 {
  name : "Create NFT Collection",
  link: "/create-nft-collection"
 },
 {
  name : "NFT Marketplace",
  link: "/nft-marketplace"
 }
]

  return (
    <div className={Style.box}>
    {discover.map((el , i)=>(
      <div key={i+1} className={Style.discover}>
        <Link href={{pathname:`${el.link}`}} legacyBehavior><a><p>{el.name}</p></a>
        </Link>
      </div> 
    ))}
   </div>
  )
}

export default Discover