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
  useEffect(() => {
    if (isLoading) {
      const abi = ["event NftMinted(string cid, address minter)"];

      const alchemyProvider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
      );

      const contractAddress = "0x2Bb634109eee5dc71602066f874DA5ABC27be9D8";

      const contract = new ethers.Contract(
        contractAddress,
        abi,
        alchemyProvider
      );

      contract.on("NftMinted", (cid, minter) => {
        console.log(`event NftMinted(${cid}, ${minter}`);
        setIsLoading(false);
      });
    }
  }, [isLoading]);

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
          onClick={async (event) => {
            event.stopPropagation();
            event.preventDefault();
            setIsLoading(true);
            const res = await handleMint();
          }}
          className={Style.button}
        >
          {isLoading ? "Loading" : "Mint"}
        </button>
      )}
    </div>
  );
}
