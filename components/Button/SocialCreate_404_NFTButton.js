import Style from "./Button.module.css";
import React, { useState, useEffect, useRef } from "react";
import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import images from "../../img";
import Image from "next/image";
const { ethers } = require("ethers");

export default function SocialCreate_404_NFTButton(props) {
  //   contract GradientCircleFactory {
  //     mapping(address => address) public getPair;

  //     event ContractCreated(address gradientCircleAddr);

  //     function createGradientCircle(
  //         address _contractOwner,
  //         address _initialTokenOwner,
  //         string memory _tokenName,
  //         string memory _tokenSymbol
  //     ) external returns (address gradientCircleAddr) {
  //         bytes32 salt = keccak256(abi.encodePacked(_tokenName, _tokenSymbol));

  //         GradientCircle gc = new GradientCircle{salt: salt}(_contractOwner, _initialTokenOwner);

  //         gc.setNameSymbol(_tokenName, _tokenSymbol);

  //         gradientCircleAddr = address(gc);
  //         getPair[gradientCircleAddr] = msg.sender;
  //         emit ContractCreated(gradientCircleAddr);
  //     }
  // }

  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const { config } = usePrepareContractWrite({
    address: props.contractAddress,
    abi: [
      {
        name: "createGradientCircle",
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
    functionName: "createGradientCircle",
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
