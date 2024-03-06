import Style from "./Button.module.css";
import React, { useState, useEffect, useRef } from "react";
import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
const { ethers } = require("ethers");

export default function BuyNFTButton(props) {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const { config } = usePrepareContractWrite({
    address: props.contractAddress,
    abi: [
      {
        name: "buyItem",
        type: "function",
        stateMutability: "payable",
        inputs: [
          { internalType: "address", name: "nftAddress", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
        ],
        outputs: [],
      },
    ],
    functionName: "buyItem",
    args: [props.nftAddress, props.tokenId],
    from: address,
    value: props.price,
  });
  const { writeAsync: buyItemWrite } = useContractWrite(config);

  async function handleBuyItem() {
    try {
      const res = await buyItemWrite();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }
  return (
    <button
      disabled={isLoading}
      onClick={async () => {
        setIsLoading(true);
        await handleBuyItem();
        setIsLoading(false);
      }}
      className={Style.button}
    >
      {isLoading ? "Loading" : "Buy now"}
    </button>
  );
}
