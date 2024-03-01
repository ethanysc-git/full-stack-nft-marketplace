import React from 'react'
import Link from "next/link"
import Style from "./Discover.module.css"



const SocailDiscover = () => {

  return (
    <div className={Style.box}>
      <div key={0} className={Style.discover}>
        <Link href={{pathname:'/'}} legacyBehavior>
        <a><p>Home Page</p></a>
        </Link>
      </div>
      <div key={1} className={Style.discover}>
        <Link href={{pathname:'/tourist-create-nft-collection'}} legacyBehavior>
        <a><p>Create NFT Collection</p></a>
        </Link>
      </div>
      <div key={1} className={Style.discover}>
        <Link href={{pathname:'/tourist-nft-marketplace'}} legacyBehavior>
        <a><p>NFT Marketplace</p></a>
        </Link>
      </div>
   </div>
  )
}

export default SocailDiscover