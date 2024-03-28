import Style from "./Button.module.css";
import React, { useState, useEffect, useContext, useMemo } from "react";
import { Button } from "@chakra-ui/react";
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
import { parseEther, formatEther } from "viem";
import { ToastContainer, toast, TypeOptions } from "react-toastify";
const { ethers } = require("ethers");

export default function SocialUpdateListingButton(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [approveIsSuccess, setApproveIsSuccess] = useState(false);
  const [approveIsDone, setApproveIsDone] = useState(false);
  const [price, setPrice] = useState("");
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
      // toast(`Switch Chain error : ${error}`, {
      //   type: "error",
      // });
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
          data: dragonMintMarketplace.interface.encodeFunctionData(
            "updateListing",
            [props.nftAddress, props.tokenId, price, props.tokenUri]
          ),
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
      if (!isListening) {
        setIsListening(true);
        contract.on(
          "ItemListed",
          (seller, nftAddress, tokenId, price, tokenUri) => {
            console.log(
              `event ItemListed(${seller}, ${nftAddress}, ${tokenId}, ${price}, ${tokenUri}`
            );
            toast("Update list item successfully", {
              type: "success",
            });
            setIsLoading(false);
          }
        );
      }
    }
  }, [isLoading]);

  return (
    <div className={Style.container}>
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
        <input
          placeholder="Enter Price(ETH)"
          onChange={(e) => {
            setPrice(parseEther(e.target.value));
          }}
        />
      )}
      {!isLoading && (
        <button
          disabled={isLoading}
          onClick={async (event) => {
            event.stopPropagation();
            event.preventDefault();
            toast(`Update list item is pending`, {
              type: "default",
            });
            setIsListening(false);
            setIsLoading(true);
            await handleSwitch();
            await executeUserOpAndGasNativeByPaymaster();
          }}
          className={Style.button}
        >
          {isLoading ? "Loading" : "$:Update"}
        </button>
      )}
    </div>
  );
}
