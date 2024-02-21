import React, { useState } from "react"
import Image from 'next/link';
import Link from "next/link"
import { GrClose } from 'react-icons/gr';
import {
    TiSocialFacebook,
    TiSocialLinkedin,
    TiSocialTwitter,
    TiSocialYoutube,
    TiSocialInstagram,
    TiArrowSortedDown,
    TiArrowSortedUp
} from 'react-icons/ti';

// internal import

import Style from './SideBar.module.css'
import images from '../../../img'
import Button from '../../Button/Button'

const SideBar=({setOpenSideMenu}) =>{
    const [openDiscover, setOpenDiscover] = useState(false);
    const [openHelp, setOpenHelp] = useState(false);


    //---------DISCOVER NAVIGATION
    const discover = [
        {
            name: "Collection",
            link: "collection"
        },
        {
            name: "Search",
            link: "search"
        },
        {
            name: "Author Profile",
            link: "author-profile"
        },
        {
            name: "Acount Setting",
            link: "account-setting"
        },
        {
            name: "NFT Details",
            link: "NFT-details"
        },
        {
            name: "Connect Wallet",
            link: "connect-wallet"
        },
        {
            name: "Blog",
            link: "blog"
        }
    ];

    //......Help Center

    const helpCenter = [
        {
            name: "About",
            link: "about"
        },
        {
            name: "Contact us ",
            link: "contact-us"
        },
        {
            name: "Sign Up",
            link: "sign-up"
        },
        {
            name: "Sign In",
            link: "sign-in"
        },
        {
            name: "Subscription",
            link: "subscription"
        }
    ];

const openDiscoverMenu=()=>{
    if(!openDiscover){
        setOpenDiscover(true);
    }else{
        openDiscover(false)
    }
}

const openHelpMenu=()=>{
   if(!openHelp){
    openHelp(true)
   }else{
    openHelp(false)
   } 
}

const closeSideBar=()=>{
  setOpenSideMenu(false)  
}
    return (
        <div className={Style.sideBar}>
            <GrClose
                className={Style.sideBar_closeBtn}
                onClick={() => closeSideBar()}
            />
            <div className={Style.sideBar_box}>
                <Image src={images.logo} alt="logo"
                    width={150}
                    height={150} />
                <p>Discover the most outstanding articles on all topics of NFT and
                    your on stories and share thes
                </p> 
                <div className={Style.sideBar_social}>
                    <a href="#"><TiSocialFacebook /></a>
                    <a href="#"><TiSocialLinkedin /></a>
                    <a href="#"><TiSocialYoutube /></a>
                    <a href="#"><TiSocialInstagram /></a>
                    <a href="#"><TiSocialTwitter /></a>
                </div>
            </div>
            <div className={Style.sideBar_menu}>
                <div>
                    <div className={Style.sideBar_menu_box} onClick={() => openDiscoverMenu}>
                        <p>Discover</p>
                        <TiArrowSortedDown />
                    </div>
                    {
                        openDiscover && (
                            <div className={Style.sideBar_discover}>
                                {
                                    discover.map((el, i) => (
                                        <p key={i + 1}>
                                            <Link href={{ pathname: `${el.link}` }}>{el.name}</Link>
                                        </p>
                                    ))
                                }
                            </div>
                        )
                    }
                </div>
                <div className="">
                   <div className={Style.sideBar_menu_box} onClick={()=>openHelpMenu()}>
                      <p>Help Center</p>
                      <TiArrowSortedDown/>
                    </div> 
                    {
                        openHelp && (
                            <div className={Style.sideBar_discover}>
                                {
                                helpCenter.map(
                                    (el,i)=>(
                                      <p key={i+1}>
                                        <Link href={{pathname:`${el.link}`}}>{el.name}</Link>
                                      </p>  
                                    )
                                )

                                }
                            </div>
                        )
                    }
                </div>
            </div>
            <div className={Style.sideBar_button}>
              <Button btnName="Create" handleClick={()=>{}}/>
              <Button btnName="Connect Wallet" handleClick={()=>{}}/>  
            </div>
        </div>
    )
}

export default SideBar