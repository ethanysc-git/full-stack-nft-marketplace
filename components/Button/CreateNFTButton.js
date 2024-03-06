import Style from "./Button.module.css";
import React, { useState, useEffect, useRef } from "react";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import images from "../../img";
import Image from "next/image";
const { ethers } = require("ethers");

export default function CreateNFTForm(props) {
  const [isLoading, setIsLoading] = useState(false);
  const { config } = usePrepareContractWrite({
    address: props.contractAddress,
    abi: [
      {
        name: "createUnitNft",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { internalType: "string", name: "_tokenName", type: "string" },
          { internalType: "string", name: "_tokenSymbol", type: "string" },
          {
            internalType: "uint256",
            name: "_tokenTotalSupply",
            type: "uint256",
          },
        ],
        outputs: [],
      },
    ],
    functionName: "createUnitNft",
    args: [
      props.collectionNameInput,
      props.collectionSymbolInput,
      props.collectionTotalSupplyInput,
    ],
  });

  const { writeAsync: createUnitNftWrite } = useContractWrite(config);

  async function handleCreateUnitNftWrite() {
    try {
      const res = await createUnitNftWrite();
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
      <button
        disabled={isLoading}
        onClick={async () => {
          setIsLoading(true);
          await handleCreateUnitNftWrite();
          setIsLoading(false);
        }}
        className={Style.button}
      >
        {isLoading ? "Loading" : "Create"}
      </button>
    </div>
  );
}
