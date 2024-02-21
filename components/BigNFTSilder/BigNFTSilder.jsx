import React ,{useState,useEffect,useCallback}from 'react'
import Image from 'next/image'
import {AiFillFire,AiFillHeart,AiOutlineHeart} from 'react-icons/ai'
import { MdVerified,MdTimer } from 'react-icons/md'
import { TbArrowBigLeftLine,TbArrowBigRightLine   } from 'react-icons/tb'
import Style from './BigNFTSilder.module.css'
import images from '../../img'
import Button from '../Button/Button'
const BigNFTSilder = () => {
    const [idNumber , setIdNumber] = useState(1);
    const sliderData=[
       {
        tirle:"NFT",
        id:1,
        name:"Shahid Nawaz",
        collection:"Gym",
        price:"000007657 ETH",
        like:535,
        image:images.user1,
        nftImage:images.nft_image_1,
        time:{
            days:27,
            hours:10,
            minutes:11,
            seconds:35
        }
       },
       {
        tirle:"NFT 2",
        id:1,
        name:"Kamran Nawaz",
        collection:"Gym",
        price:"000007657 ETH",
        like:535,
        image:images.user2,
        nftImage:images.nft_image_3,
        time:{
            days:27,
            hours:10,
            minutes:11,
            seconds:35
        }
       },
       {
        tirle:"NFT3",
        id:3,
        name:"Amir Nawaz",
        collection:"Gysdouysm",
        price:"000007657 ETH",
        like:535,
        image:images.user3,
        nftImage:images.nft_image_2,
        time:{
            days:27,
            hours:10,
            minutes:11,
            seconds:35
        }
       },
       {
        tirle:"NFT4",
        id:4,
        name:"Zahid Nawaz",
        collection:"Gymssdss",
        price:"07657 ETH",
        like:5375,
        image:images.user4,
        nftImage:images.nft_image_3,
        time:{
            days:27,
            hours:10,
            minutes:11,
            seconds:35
        }
       }
    ];
  return (
    <div>BigNFTSilder</div>
  )
}

export default BigNFTSilder