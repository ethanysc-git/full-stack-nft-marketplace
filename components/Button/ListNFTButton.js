import Style from "./Button.module.css";
import React, { useState, useEffect, useRef } from "react";
import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import { parseEther, formatEther } from "viem";
const { ethers } = require("ethers");

export default function ListNFTButton(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [approveIsSuccess, setApproveIsSuccess] = useState(false);
  const [approveIsDone, setApproveIsDone] = useState(false);
  const [price, setPrice] = useState("");

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

  const DragonMintMarketplace_ABI = require("../dragonMintMarketplace.json");
  const { write } = useContractWrite({
    address: "0x1c92920ca2445C3c29A9CcC551152317219C61A6",
    abi: DragonMintMarketplace_ABI,
    functionName: "listItem",
    args: [props.nftAddress, props.tokenId, price, props.tokenUri],
  });

  function handleListItem() {
    try {
      write();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (approveIsSuccess && !approveIsDone) {
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
        console.log(`Start handleListItem()`);
        handleListItem();
        console.log(`End handleListItem()`);
        setApproveIsDone(true);
      });
    }
  }, [approveIsSuccess]);

  useEffect(() => {
    if (approveIsDone) {
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

      contract.on(
        "ItemListed",
        (seller, nftAddress, tokenId, price, tokenUri) => {
          console.log(
            `event ItemListed(${seller}, ${nftAddress}, ${tokenId}, ${price}, ${tokenUri}`
          );
          setIsLoading(false);
        }
      );
    }
  }, [approveIsDone]);

  return (
    <div>
      <input
        placeholder="Enter Price(ETH)"
        onChange={(e) => {
          setPrice(parseEther(e.target.value));
        }}
      />
      <button
        onClick={async () => {
          setIsLoading(true);
          await handleApprove();
          setApproveIsSuccess(true);
        }}
        className={Style.button}
      >
        {isLoading ? "Loading" : "List Item"}
      </button>
    </div>
  );
}
