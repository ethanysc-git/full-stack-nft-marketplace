import React from 'react'
import Image from "next/image";
import {FaUserAlt,FaRegImage,FaUserEdit} from "react-icons/fa"
import Link from "next/link"
import Style from "./Profile.module.css";
import images from "../../../img";
 

const Profile = () => {
  return (
    <div className={Style.profile}>
      <div className={Style.profile_account}>
        <Image src={images.profile} alt='user profile'
        width={50}
        height={50}
        className={Style.profile_account_img}
        />
        <div className={Style.profile_account_info}>
          <p>Shoaib bhai</p>
          <p>x087248732234</p>
        </div>
      </div>
      <div className={Style.profile_menu}>
        <div className={Style.profile_menu_one}>
          <div className={Style.profile_menu_one_item}>
            <FaUserAlt/>
            <p>
              <Link href={{pathname:'/myprofile'}}>My Profile</Link>
            </p>
          </div>
          <div className={Style.profile_menu_one_item}>
            <FaRegImage/>
            <p>
              <Link href={{pathname:'/my-items'}}>My Items</Link>
            </p>
          </div>
          <div className={Style.profile_menu_one_item}>
            <FaUserEdit/>
            <p>
              <Link href={{pathname:'/edit-profile'}}>Edit Profile</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile