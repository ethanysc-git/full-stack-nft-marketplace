import Style from "./Button.module.css";
import React, { useState, useEffect, useRef } from "react";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { parseEther, formatEther } from "viem";
const { ethers } = require("ethers");

export default function UpdateListingButton({
  contractAddress,
  nftAddress,
  tokenId,
  tokenUri,
  isLoading,
  setIsLoading,
}) {
  // const [isLoading, setIsLoading] = useState(false);
  const [price, setPrice] = useState("");
  const { config: updateListingConfig } = usePrepareContractWrite({
    address: contractAddress,
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
    args: [nftAddress, tokenId, price, tokenUri],
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
      {!isLoading && (
        <div>
          <input
            placeholder="Enter Price(ETH)"
            onChange={(e) => {
              setPrice(parseEther(e.target.value));
            }}
          />
          <button
            disabled={isLoading}
            onClick={async () => {
              setIsLoading(true);
              const res = await handleUpdateListing();
              setIsLoading(false);
            }}
            className={Style.button}
          >
            {isLoading ? "Loading" : "Update $"}
          </button>
        </div>
      )}
    </div>
  );
}
