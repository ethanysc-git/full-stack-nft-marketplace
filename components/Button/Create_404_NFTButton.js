import Style from "./Button.module.css";
import React, { useState, useEffect, useRef } from "react";
import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import images from "../../img";
import Image from "next/image";
const { ethers } = require("ethers");

export default function Create_404_NFTButton(props) {
  // event ContractCreated(address GradientColorAddr);

  // function createGradientColor(
  //     address _contractOwner,
  //     address _initialTokenOwner,
  //     string memory _tokenName,
  //     string memory _tokenSymbol
  // ) external returns (address GradientColorAddr) {
  //     bytes32 salt = keccak256(abi.encodePacked(_tokenName, _tokenSymbol));

  //     GradientColor gc = new GradientColor{salt: salt}(
  //         _contractOwner,
  //         _initialTokenOwner,
  //         _tokenName,
  //         _tokenSymbol
  //     );

  //     //gc.setNameSymbol(_tokenName, _tokenSymbol);

  //     GradientColorAddr = address(gc);
  //     getPair[GradientColorAddr] = msg.sender;
  //     emit ContractCreated(GradientColorAddr);
  // }

  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const { config } = usePrepareContractWrite({
    address: props.contractAddress,
    abi: [
      {
        name: "createGradientColor",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { internalType: "address", name: "_contractOwner", type: "address" },
          {
            internalType: "address",
            name: "_initialTokenOwner",
            type: "address",
          },
          { internalType: "string", name: "_tokenName", type: "string" },
          { internalType: "string", name: "_tokenSymbol", type: "string" },
        ],
        outputs: [],
      },
    ],
    functionName: "createGradientColor",
    args: [
      address,
      address,
      props.collectionNameInput,
      props.collectionSymbolInput,
    ],
  });

  const { writeAsync: create_404_NftWrite } = useContractWrite(config);

  async function handleCreate_404_NftWrite() {
    try {
      const res = await create_404_NftWrite();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <div>
      {isLoading && (
        <>
          <Image
            src={images.snailloading}
            alt="Loading logo"
            width={80}
            height={80}
          />
          <p>{isLoading ? "Loading" : ""}</p>
        </>
      )}
      {!isLoading && (
        <button
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true);
            await handleCreate_404_NftWrite();
            setIsLoading(false);
          }}
          className={Style.button}
        >
          {isLoading ? "Loading" : "Create"}
        </button>
      )}
    </div>
  );
}
