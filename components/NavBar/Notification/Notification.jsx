import React from 'react'
import Image from "next/image"
import Style from "./Notification.module.css"
import images from "../../../img"
const Notification = (props) => {
  let userName = "CrptoGeek"
  if(props._userInfo) {
    userName = props._userInfo.name;
  }
  return (
    <div className={Style.notification}>
      <p>Notification</p>
      <div className={Style.notification_box}>
        <div className={Style.notification_box_img}>
          <Image src={images.hero} alt='Profile image'
           width={50} height={50}
           className={Style.notification_box_img}/>
        </div>
        <div className={Style.notification_box_info}>
          <h4>{userName}</h4>
          <p>Welcome to Drangon Mint</p>
          <p></p>
        </div>
        <span className={Style.notification_box_new}></span>
      </div>
    </div>
  )
}

export default Notification