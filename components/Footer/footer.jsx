import React from 'react'
import Image from 'next/image';

import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialTwitter,
  TiSocialYoutube,
  TiSocialInstagram,
} from 'react-icons/ti';
import { RiSendPlaneFill } from 'react-icons/ri';
import Style from './footer.module.css';
import images from '../../img'
import { Discover, About } from '../NavBar/index'

const footer = () => {
  return (
    <div className={Style.footer}>
      <div className={Style.footer_box}>
        <div className={Style.footer_box_social}>
          <a href="/" target="_self" rel="noreferrer noopenner">
            <Image src={images.hero} alt='footer logo' height={100} width={100} />
          </a>       
          <div className={Style.footer_social}>
            <a href="#"><TiSocialFacebook /></a>
            <a href="#"><TiSocialLinkedin /></a>
            <a href="#"><TiSocialYoutube /></a>
            <a href="#"><TiSocialInstagram /></a>
            <a href="#"><TiSocialTwitter /></a>
          </div>
        </div>
        <div>
          <h3>Discover</h3>
          <Discover />
        </div>
        <div>
          <h3>About</h3>
          <About />
        </div>
        <div className={Style.subscribe}>
          <h1>Subscribe Here</h1>
          <div className={Style.subscribe_box}>
            <input type='email' placeholder='Enter your Email *' />
            <RiSendPlaneFill className={Style.subscribe_box_send} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default footer