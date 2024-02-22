import React from 'react'
import Image from 'next/image'
import Style from './HeroSection.module.css'
import { Button, NFTBox } from '../componentindex'
import images from "../../img"
//
import { useState, useRef } from "react";
import { useAccount } from "wagmi";
import MintNFTButton from '../Button/MintNFTButton'
//

//

const HeroSection = () => {
    const [file, setFile] = useState("");
    const [cid, setCid] = useState("");
    const [uploading, setUploading] = useState(false);
    
    const inputFile = useRef(null);
    
    const uploadFile = async (fileToUpload) => {
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append("file", fileToUpload, { filename: fileToUpload.name });
        const res = await fetch("/api/files", {
          method: "POST",
          body: formData,
        });
        const ipfsHash = await res.text();
        setCid(ipfsHash);
        setUploading(false);
      } catch (e) {
        console.log(e);
        setUploading(false);
        alert("Trouble uploading file");
      }
    };
    
    const handleChange = (e) => {
      setFile(e.target.files[0]);
      uploadFile(e.target.files[0]);
    };
    
    const loadRecent = async () => {
      try {
        if (address == "0x1B1432102D127AaedDf9cD97dd744B7384625a72") {
          const res = await fetch("/api/files");
          const json = await res.json();
          setCid(json.ipfs_pin_hash);
        }
      } catch (e) {
        console.log(e);
        alert("trouble loading files");
      }2
    };
    
    const { address, isConnected } = useAccount();



  return (
    <div className={Style.heroSection}>
        <div className={Style.heroSection_box}>
            <div className={Style.heroSection_box_left}>
                <h1>Discover, Collect and sell NFT</h1>
                <p>
                    Upload your photo below and mint your own NFT.
                </p>   
                {/* <Button btnName="Upload"/>   */}
                <input
                  type="file"
                  id="file"
                  ref={inputFile}
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
                  <button
                  className={Style.heroSection_upload_button}
                    disabled={uploading}
                    onClick={() => inputFile.current.click()}                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                  {cid && <NFTBox cid={cid} />}
                  {cid && !uploading && (
                  <MintNFTButton
                    cid={cid}
                    contractAddress="0x2Bb634109eee5dc71602066f874DA5ABC27be9D8"
                  />
                )}
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