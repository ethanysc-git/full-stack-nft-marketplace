import Style from "./Button.module.css";
import React, { useState, useEffect, useRef } from "react";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import images from "../../img";
import Image from "next/image";
const { ethers } = require("ethers");

export default function UpdateListingButton(props) {
  const [isLoading, setIsLoading] = useState(false);
  const { config: updateListingConfig } = usePrepareContractWrite({
    address: props.contractAddress,
    abi: [
      {
        name: "updateListing",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { internalType: "address", name: "nftAddress", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "uint256", name: "price", type: "uint256" },
          { internalType: "string", name: "tokenUri", type: "string" },
        ],
        outputs: [],
      },
    ],
    functionName: "updateListing",
    args: [props.nftAddress, props.tokenId, props.price, props.tokenUri],
  });

  const { writeAsync: updateListingWrite } =
    useContractWrite(updateListingConfig);

  async function handleUpdateListing() {
    try {
      const res = await updateListingWrite();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <div>
      {isLoading && (
        <Image
          src={images.snailloading}
          alt="Loading logo"
          width={80}
          height={80}
        />
      )}
      {!isLoading && (
        <button
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true);
            const res = await handleUpdateListing();
            setIsLoading(false);
          }}
          className={Style.button}
        >
          {isLoading ? "Loading" : "Update Price"}
        </button>
      )}
    </div>
  );
}
