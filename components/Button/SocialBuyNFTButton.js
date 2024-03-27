import Style from "./Button.module.css";
import React, { useState, useEffect, useContext, useMemo } from "react";
import { ethers } from "ethers";
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

export default function SocialBuyNFTButton(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const {
    address,
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
      const dragonMintMarketplaceAddress =
        "0x1c92920ca2445C3c29A9CcC551152317219C61A6";
      const DragonMintMarketplace_ABI = require("../dragonMintMarketplace.json");
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
      );
      const dragonMintMarketplace = new ethers.Contract(
        dragonMintMarketplaceAddress,
        DragonMintMarketplace_ABI,
        provider
      );
      const txs = [
        {
          to: dragonMintMarketplaceAddress,
          data: dragonMintMarketplace.interface.encodeFunctionData("buyItem", [
            props.nftAddress,
            props.tokenId,
          ]),
          value: props.price,
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
      toast(`Buy item error : ${error}`, {
        type: "error",
      });
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isLoading) {
      const abi = [
        "event ItemBought(address indexed buyer, address indexed nftAddress, uint256 indexed tokenId, uint256 price)",
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

      contract.on("ItemBought", (seller, nftAddress, tokenId) => {
        if (!isListening) {
          setIsListening(true);
          console.log(`event ItemBought(${seller}, ${nftAddress}, ${tokenId}`);
          toast("Buy item successfully", {
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
          toast(`Buy item is pending`, {
            type: "default",
          });
          setIsListening(false);
          setIsLoading(true);
          await handleSwitch();
          await executeUserOpAndGasNativeByPaymaster();
        }}
        className={Style.button}
      >
        {isLoading ? "Loading" : "Buy Now"}
      </button>
    </div>
  );
}
