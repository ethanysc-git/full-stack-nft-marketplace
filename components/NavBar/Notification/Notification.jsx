import React from 'react'
import Image from "next/image"
//INTERNAL IMPORT
import Style from "./Notification.module.css"
import images from "../../../img"
const Notification = () => {
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
          <h4>Shoaib Akhter</h4>
          <p>Measure actions your user...</p>
          <p>3 minutes ago </p>
        </div>
        <span className={Style.notification_box_new}></span>
      </div>
    </div>
  )
}

export default Notification