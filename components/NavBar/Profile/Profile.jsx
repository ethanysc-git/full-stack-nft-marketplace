import React from 'react'
import Image from "next/image";
import {FaUserAlt,FaRegImage,FaUserEdit} from "react-icons/fa"
import Link from "next/link"
import Style from "./Profile.module.css";
import images from "../../../img";
 

const Profile = (props) => {
  return (
    <div className={Style.profile}>
      <div className={Style.profile_account}>
        <Image src={images.profile} alt='user profile'
        width={50}
        height={50}
        className={Style.profile_account_img}
        />
        <div className={Style.profile_account_info}>
          <p>{props.userName}</p>
        </div>
      </div>
      <div className={Style.profile_menu}>
        <div className={Style.profile_menu_one}>
          <div className={Style.profile_menu_one_item}>
            <FaUserAlt/>
            {!(props.crptoGeek) &&(            <p>
              <Link href={{pathname:'/myprofile'}} legacyBehavior>My Profile</Link>
            </p>)}
            {(props.crptoGeek) &&(            <p>
              <Link href={{pathname:'/mycrptogeekprofile'}} legacyBehavior>My Profile</Link>
            </p>)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile