import Style from "./Button.module.css";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@chakra-ui/react";
import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import images from "../../img";
import Image from "next/image";
const { ethers } = require("ethers");

export default function TransferNFTButton(props) {
  const [isLoading, setIsLoading] = useState(false);
  const { config } = usePrepareContractWrite({
    address: props.contractAddress,
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
    args: [props.nftAddress, props.tokenId],
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
    <div className={Style.container}>
      {isLoading && (
        <Button
          isLoading
          loadingText="Loading"
          colorScheme="teal"
          variant="outline"
          spinnerPlacement="end"
          className={Style.button}
        >
          Pending
        </Button>
      )}
      {!isLoading && (
        <button disabled={isLoading} className={Style.button}>
          {isLoading ? "Loading" : "Transfer To ..."}
        </button>
      )}
    </div>
  );
}
