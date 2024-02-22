import React from 'react'
import Style from './Service.module.css'
import Image from 'next/image'
import images from '../../img'

 
const Service = () => {
  return (
    <div className={Style.service}>
     <div className={Style.service_box}>
        <div className={Style.service_box_item}>
            <Image
             src={images.uploadfolder} 
             alt='Filter and Discover'
             width={100}
             height={100}
             />
             <p className={Style.service_box_item_step}>
                <span> Step 1</span>
             </p>
             <h3>Upload your photograph</h3>
             <p>
                  Upload your photograph to IPFS Network
             </p>
        </div>
        <div className={Style.service_box_item}>
            <Image
             src={images.service2} 
             alt='Connect Wallet'
             width={100}
             height={100}
             />
             <p className={Style.service_box_item_step}>
                <span> Step 2</span>
             </p>
             <h3>Connect Wallet</h3>
             <p>
                  Connect to your Wallet
             </p>
        </div>
        
        <div className={Style.service_box_item}>
            <Image
             src={images.service4} 
             alt='Start Minting'
             width={100}
             height={100}
             /> 
             <p className={Style.service_box_item_step}>
                <span> Step 3</span>
             </p>
             <h3>Start Minting</h3>
             <p>
                connet the wallet, mint NFTs, sell your NFTs and earn money
             </p>
        </div>
     </div>
    </div>
  )
}

export default Service