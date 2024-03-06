import Style from "./Button.module.css";
import React, { useState, useEffect, useRef } from "react";
import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import images from "../../img";
import Image from "next/image";
const { ethers } = require("ethers");

export default function ListNFTButton(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [approveIsSuccess, setApproveIsSuccess] = useState(false);
  const [approveEventIsListening, setApproveEventIsListening] = useState(false);

  const { config: approveConfig } = usePrepareContractWrite({
    address: "0x2Bb634109eee5dc71602066f874DA5ABC27be9D8",

    abi: [
      {
        name: "approve",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
        ],
        outputs: [],
      },
    ],
    functionName: "approve",
    args: ["0x1c92920ca2445C3c29A9CcC551152317219C61A6", props.tokenId],
  });

  const { isSuccess, writeAsync: approveWrite } =
    useContractWrite(approveConfig);

  async function handleApprove() {
    try {
      approveWrite();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  const { config: listItemConfig } = usePrepareContractWrite({
    address: props.contractAddress,
    abi: [
      {
        name: "listItem",
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
    functionName: "listItem",
    args: [props.nftAddress, props.tokenId, props.price, props.tokenUri],
  });

  const { writeAsync: listItemWrite } = useContractWrite(listItemConfig);

  useEffect(() => {
    if (approveEventIsListening) {
      const abi = [
        "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
      ];

      const alchemyProvider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
      );

      const contractAddress = "0x2Bb634109eee5dc71602066f874DA5ABC27be9D8";

      const contract = new ethers.Contract(
        contractAddress,
        abi,
        alchemyProvider
      );

      contract.on("Approval", (owner, approved, tokenId) => {
        console.log(`event Approval(${owner}, ${approved}, ${tokenId}`);
        setApproveIsSuccess(true);
      });
    }
  }, [approveEventIsListening]);
  useEffect(() => {
    if (approveIsSuccess) {
      const handleListItem = async () => {
        const res = await listItemWrite();
      };
      handleListItem().catch((err) => {
        setIsLoading(false);
        console.log("error:", err.message);
      });

      const abi = [
        "event ItemListed(address indexed seller, address indexed nftAddress, uint256 indexed tokenId, uint256 price, string tokenUri)",
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

      contract.on("ItemListed", (seller, nftAddress, tokenId) => {
        console.log(`event ItemListed(${seller}, ${nftAddress}, ${tokenId}`);
        setIsLoading(false);
      });
    }
  }, [approveIsSuccess]);
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
          onClick={async () => {
            setIsLoading(true);
            await handleApprove();
            setApproveEventIsListening(true);
          }}
          className={Style.button}
        >
          {isLoading ? "Loading" : "List Item"}
        </button>
      )}
    </div>
  );
}
