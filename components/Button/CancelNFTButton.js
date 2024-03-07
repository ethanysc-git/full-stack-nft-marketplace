import Style from "./Button.module.css";
import React, { useState, useEffect, useRef } from "react";
import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import images from "../../img";
import Image from "next/image";
const { ethers } = require("ethers");

export default function CancelNFTButton({
  contractAddress,
  nftAddress,
  tokenId,
  isLoading,
  setIsLoading,
}) {
  // const [isLoading, setIsLoading] = useState(false);
  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: [
      {
        name: "cancelListing",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { internalType: "address", name: "nftAddress", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
        ],
        outputs: [],
      },
    ],
    functionName: "cancelListing",
    args: [nftAddress, tokenId],
  });
  const { writeAsync: cancelListingWrite } = useContractWrite(config);

  async function handleCancelListing() {
    try {
      const res = await cancelListingWrite();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <div>
      {!isLoading && (
        <button
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true);
            await handleCancelListing();
            setIsLoading(false);
          }}
          className={Style.button}
        >
          {isLoading ? "Loading" : "Cancel Listing"}
        </button>
      )}
    </div>
  );
}
