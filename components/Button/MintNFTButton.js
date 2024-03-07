import Style from "./Button.module.css";
import React, { useState, useEffect, useRef } from "react";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import images from "../../img";
import Image from "next/image";
const { ethers } = require("ethers");

export default function MintNFTButton(props) {
  const [isLoading, setIsLoading] = useState(false);
  const { config } = usePrepareContractWrite({
    address: props.contractAddress,
    abi: [
      {
        name: "mint",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [{ internalType: "string", name: "tokenUri", type: "string" }],
        outputs: [],
      },
    ],
    functionName: "mint",
    args: ["ipfs://" + props.cid],
  });
  const { writeAsync: mintWrite } = useContractWrite(config);

  async function handleMint() {
    try {
      const res = await mintWrite();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <div>
      {isLoading && (
        <>
          <Image
            src={images.snailloading}
            alt="Loading logo"
            width={80}
            height={80}
          />
          <p>{isLoading ? "Loading" : ""}</p>
        </>
      )}
      {!isLoading && (
        <button
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true);
            const res = await handleMint();
            setIsLoading(false);
          }}
          className={Style.button}
        >
          {isLoading ? "Loading" : "Mint"}
        </button>
      )}
    </div>
  );
}
