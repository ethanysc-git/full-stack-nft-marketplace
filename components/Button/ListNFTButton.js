import Style from "./Button.module.css";
import React, { useState, useEffect, useRef } from "react";
import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
const { ethers } = require("ethers");

export default function ListNFTButton(props) {
  const [txHash, setTxHash] = useState(false);

  const alchemyProvider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
  );

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

  const {
    isLoading: approveIsLoading,
    isSuccess: approveIsSuccess,
    writeAsync: approveWrite,
  } = useContractWrite(approveConfig);

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

  const { write: listItemWrite } = useContractWrite(listItemConfig);

  useEffect(() => {
    if (approveIsSuccess) {
      const abi = [
        "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
      ];

      const contractAddress = "0x2Bb634109eee5dc71602066f874DA5ABC27be9D8";

      const contract = new ethers.Contract(
        contractAddress,
        abi,
        alchemyProvider
      );

      contract.on("Approval", (owner, approved, tokenId) => {
        console.log(`event Approval(${owner}, ${approved}, ${tokenId}`);
        setTxHash(true);
      });
    }
  }, [approveIsLoading, approveIsSuccess]);
  useEffect(() => {
    if (txHash) {
      listItemWrite();
    }
  }, [txHash]);
  return (
    <button onClick={() => approveWrite({})} className={Style.button}>
      {approveIsLoading ? "Loading" : "List Item"}
    </button>
  );
}
