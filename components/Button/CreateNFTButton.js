import Style from "./Button.module.css";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@chakra-ui/react";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import images from "../../img";
import Image from "next/image";
import { ToastContainer, toast, TypeOptions } from "react-toastify";
const { ethers } = require("ethers");

export default function CreateNFTButton(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
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
      // toast(`Create NFT error : ${error}`, {
      //   type: "error",
      // });
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isLoading) {
      const abi = ["event ContractCreated(address unitAddr)"];

      const alchemyProvider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
      );

      const contractAddress = "0x34Eb633C2f2346979eB89385A2b5fbBa8C9740f4";

      const contract = new ethers.Contract(
        contractAddress,
        abi,
        alchemyProvider
      );
      if (!isListening) {
        setIsListening(true);
        contract.on("ContractCreated", (unitAddr) => {
          console.log(`event ContractCreated(${unitAddr}`);
          toast("Contract Created successfully", {
            type: "success",
          });
          setIsLoading(false);
        });
      }
    }
  }, [isLoading]);

  return (
    <div>
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
            toast(`Contract Created is pending`, {
              type: "default",
            });
            setIsListening(false);
            setIsLoading(true);
            await handleCreateUnitNftWrite();
          }}
          className={Style.button}
        >
          {isLoading ? "Loading" : "Create"}
        </button>
      )}
    </div>
  );
}
