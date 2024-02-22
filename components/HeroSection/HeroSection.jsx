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
                    Upload your photo below and mint your own NFT.
                </p>   
                <Button btnName="Upload"/>     
                <div>
                    <Image
                    priority
                    src={images.hero}
                    alt='Hero Section'
                    width = {250}
                    height = {250}
                    />
                    <Button btnName="Mint"/>
                </div>    
            </div>
            <div className={Style.heroSection_box_right}>
                <Image
                priority
                 src={images.hero}
                 alt='Hero Section'
                className={Style.heroSection_image_right}
                />
            </div>
            <div>
                       

            </div>
        </div>
    </div>
  )
}

export default HeroSection