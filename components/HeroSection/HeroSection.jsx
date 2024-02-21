import React from 'react'
import Image from 'next/image'
import Style from './HeroSection.module.css'
import { Button } from '../componentindex'
import images from "../../img"


const HeroSection = () => {
  return (
    <div className={Style.heroSection}>
        <div className={Style.heroSection_box}>
            <div className={Style.heroSection_box_left}>
                <h1>Discover, Collect and sell NFT</h1>
                <p>
                    Discover the most outstanding NFTs in all topics 
                    your NFTs and sell them.
                </p>
                <Button btnName="Start your Search"/>
            </div>
            <div className={Style.heroSection_box_right}>
                <Image
                 src={images.hero}
                 alt='Hero Section'
                 width={600}
                 height={600}
                />
            </div>
        </div>
    </div>
  )
}

export default HeroSection