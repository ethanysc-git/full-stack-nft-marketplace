import React from 'react'
import Image from 'next/image'
import Style from './HeroSection.module.css'
import { NFTBox } from '../componentindex'
import images from "../../img"
import { useState, useRef } from "react";
import MintNFTButton from '../Button/MintNFTButton'
import SocailMintNFTButton from '../Button/SocailMintNFTButton'
import { useAccount, useWaitForTransaction } from "wagmi";
import {
  useConnect,
  useEthereum,
  useAuthCore,
} from "@particle-network/auth-core-modal";

const HeroSection = () => {
    const { address, isConnected } = useAccount();
    const { connect, disconnect, connectionStatus } = useConnect();
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
    
    // const loadRecent = async () => {
    //   try {
    //     if (address == "0x1B1432102D127AaedDf9cD97dd744B7384625a72") {
    //       const res = await fetch("/api/files");
    //       const json = await res.json();
    //       setCid(json.ipfs_pin_hash);
    //     }
    //   } catch (e) {
    //     console.log(e);
    //     alert("trouble loading files");
    //   }
    // };
    
    

  return (
    <div className={Style.heroSection_home_page}>
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
                    {cid && !uploading && connectionStatus === "connected" && (
                      <SocailMintNFTButton
                      cid={cid}
                      contractAddress="0x2Bb634109eee5dc71602066f874DA5ABC27be9D8"
                    />
                    )}
                    {cid && !uploading && isConnected && (

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
      {/* <div
      style={{
        // use the src property of the image object
        backgroundImage: `url(${backgroundImage.src})`,
        // other styles
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        height: "100vh",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >

    </div> */}
      </div>
    </div>




  )
}

export default HeroSection