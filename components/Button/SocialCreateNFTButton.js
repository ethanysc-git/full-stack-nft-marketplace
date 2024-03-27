import Style from "./Button.module.css";
import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  useConnect,
  useEthereum,
  useAuthCore,
} from "@particle-network/auth-core-modal";
import {
  AAWrapProvider,
  SendTransactionMode,
  SmartAccount,
} from "@particle-network/aa";
import { Ethereum, EthereumSepolia } from "@particle-network/chains";
import { ChainId } from "@biconomy/core-types";
import images from "../../img";
import Image from "next/image";
import { ToastContainer, toast, TypeOptions } from "react-toastify";
const { ethers } = require("ethers");

export default function SocialCreateNFTButton(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const {
    chainId,
    provider,
    sendTransaction,
    signMessage,
    signTypedData,
    switchChain,
  } = useEthereum();
  async function handleSwitch() {
    try {
      switchChain(EthereumSepolia.id);
    } catch (error) {
      console.log(error);
      toast(`Switch Chain error : ${error}`, {
        type: "error",
      });
      setIsLoading(false);
    }
  }

  const smartAccount = new SmartAccount(provider, {
    projectId: process.env.NEXT_PUBLIC_REACT_APP_PROJECT_ID,
    clientKey: process.env.NEXT_PUBLIC_REACT_APP_CLIENT_KEY,
    appId: process.env.NEXT_PUBLIC_REACT_APP_APP_ID,
    aaOptions: {
      accountContracts: {
        SIMPLE: [{ chainIds: [chainId, ChainId.SEPOLIA], version: "1.0.0" }],
      },
      paymasterApiKeys: [
        {
          chainId: chainId,
          apiKey: process.env.NEXT_PUBLIC_REACT_APP_BICONOMY_KEY,
        },
        {
          chainId: ChainId.SEPOLIA,
          apiKey: process.env.NEXT_PUBLIC_REACT_APP_BICONOMY_KEY,
        },
      ],
    },
  });

  async function executeUserOpAndGasNativeByPaymaster() {
    try {
      const nftFactoryAddress = "0x34Eb633C2f2346979eB89385A2b5fbBa8C9740f4";
      const nftFactory_ABI = require("../unitNFT_721_Factory.json");
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
      );
      const nftFactory = new ethers.Contract(
        nftFactoryAddress,
        nftFactory_ABI,
        provider
      );
      const txs = [
        {
          to: nftFactoryAddress,
          data: nftFactory.interface.encodeFunctionData("createUnitNft", [
            props.collectionNameInput,
            props.collectionSymbolInput,
            props.collectionTotalSupplyInput,
          ]),
        },
      ];
      const feeQuotesResult = await smartAccount.getFeeQuotes(txs);
      console.log(feeQuotesResult);
      const gaslessUserOp = feeQuotesResult.verifyingPaymasterGasless?.userOp;
      const gaslessUserOpHash =
        feeQuotesResult.verifyingPaymasterGasless?.userOpHash;

      console.log(`user op: ${gaslessUserOp}`);
      console.log(`user op hash: ${gaslessUserOpHash}`);

      const txHash = await smartAccount.sendUserOperation({
        userOp: gaslessUserOp,
        userOpHash: gaslessUserOpHash,
      });
      console.log("Transaction hash: ", txHash);
    } catch (error) {
      console.log(error);
      toast(`Create NFT error : ${error}`, {
        type: "error",
      });
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

      contract.on("ContractCreated", (unitAddr) => {
        if (!isListening) {
          setIsListening(true);
          console.log(`event ContractCreated(${unitAddr}`);
          toast("Contract Created successfully", {
            type: "success",
          });
          setIsLoading(false);
        }
      });
    }
  }, [isLoading]);

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
        onClick={async (event) => {
          event.stopPropagation();
          event.preventDefault();
          toast(`Contract Created is pending`, {
            type: "default",
          });
          setIsListening(false);
          setIsLoading(true);
          await handleSwitch();
          await executeUserOpAndGasNativeByPaymaster();
        }}
        className={Style.button}
      >
        {isLoading ? "Loading" : "Create"}
      </button>
    </div>
  );
}
