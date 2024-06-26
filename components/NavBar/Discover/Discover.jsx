import React from 'react'
import Link from "next/link"
import Style from "./Discover.module.css"



const Discover = () => {

  return (
    <div>
      <div key={0} className={Style.discover}>
        <Link href="/" legacyBehavior>
        <a><p>Home Page</p></a>
        </Link>
      </div>
      <div key={1} className={Style.discover}>
        <Link href="/create" legacyBehavior>
        <a><p>Create NFT Collection</p></a>
        </Link>
      </div>
      <div key={1} className={Style.discover}>
        <Link href="/marketplace" legacyBehavior>
        {/* <Link href="/tourist-nft-marketplace" legacyBehavior> */}
        <a><p>NFT Marketplace</p></a>
        </Link>
      </div>
   </div>
  )
}

export default Discover