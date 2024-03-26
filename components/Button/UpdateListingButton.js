import Style from "./Button.module.css";
import React, { useState, useEffect, useRef } from "react";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { parseEther, formatEther } from "viem";
const { ethers } = require("ethers");

export default function UpdateListingButton(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [price, setPrice] = useState("");
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
    args: [props.nftAddress, props.tokenId, price, props.tokenUri],
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

  useEffect(() => {
    if (isLoading) {
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
  }, [isLoading]);

  return (
    <div>
      {!isLoading && (
        <div>
          <input
            disabled={isLoading}
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
