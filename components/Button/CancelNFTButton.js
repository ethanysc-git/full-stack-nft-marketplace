import Style from "./Button.module.css";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@chakra-ui/react";
import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import images from "../../img";
import Image from "next/image";
import { ToastContainer, toast, TypeOptions } from "react-toastify";
const { ethers } = require("ethers");

export default function CancelNFTButton(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
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
      // toast(`Cancel listing error : ${error}`, {
      //   type: "error",
      // });
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isLoading) {
      const abi = [
        "event ItemCanceled(address indexed seller, address indexed nftAddress, uint256 indexed tokenId)",
      ];

      const alchemyProvider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
      );

      const contractAddress = "0x1c92920ca2445C3c29A9CcC551152317219C61A6";

      const contract = new ethers.Contract(
        contractAddress,
        abi,
        alchemyProvider
      );
      if (!isListening) {
        setIsListening(true);
        contract.on("ItemCanceled", (seller, nftAddress, tokenId) => {
          console.log(
            `event ItemCanceled(${seller}, ${nftAddress}, ${tokenId}`
          );
          toast("Cancel listing successfully", {
            type: "success",
          });
          setIsLoading(false);
        });
      }
    }
  }, [isLoading]);

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
        <button
          disabled={isLoading}
          onClick={async (event) => {
            event.stopPropagation();
            event.preventDefault();
            toast(`Cancel listing is pending`, {
              type: "default",
            });
            setIsListening(false);
            setIsLoading(true);
            await handleCancelListing();
          }}
          className={Style.button}
        >
          {isLoading ? "Loading" : "Cancel List..."}
        </button>
      )}
    </div>
  );
}
