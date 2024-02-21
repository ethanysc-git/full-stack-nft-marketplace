import React from 'react'
import Image from 'next/image';
import Link from "next/link"

import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialTwitter,
  TiSocialYoutube,
  TiSocialInstagram,
  TiArrowSortedDown,
  TiArrowSortedUp
} from 'react-icons/ti';
import { RiSendPlaneFill } from 'react-icons/ri';

//internal import
import Style from './footer.module.css';
import images from '../../img'
import { Discover, HelpCenter } from '../NavBar/index'

const footer = () => {
  return (
    <div className={Style.footer}>
      <div className={Style.footer_box}>
        <div className={Style.footer_box_social}>
          <Image src={images.logo} alt='footer logo' height={100} width={100} />
          <p>The world largest and first marketplace for non-fungible tockens
            (NFTs) buy and sell exclusive digital items.
          </p>
          <div className={Style.footer_social}>
            <a href="#"><TiSocialFacebook /></a>
            <a href="#"><TiSocialLinkedin /></a>
            <a href="#"><TiSocialYoutube /></a>
            <a href="#"><TiSocialInstagram /></a>
            <a href="#"><TiSocialTwitter /></a>
          </div>
        </div>
        <div className={Style.footer_box_discover}>
          <h3>Discover</h3>
          <Discover />
        </div>
        <div className={Style.footer_box_help}>
          <h3>Help Center</h3>
          <HelpCenter />
        </div>
        <div className={Style.subscribe}>
          <h1>Subscribe Here</h1>
          <div className={Style.subscribe_box}>
            <input type='email' placeholder='Enter your Email *' />
            <RiSendPlaneFill className={Style.subscribe_box_send} />
          </div>
          <div className={Style.subscribe_box_info}>
            <p>
              Discover , collection and sell extraordinary NFTs
              OpenSea is the first and largest NFT marketplace.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default footer