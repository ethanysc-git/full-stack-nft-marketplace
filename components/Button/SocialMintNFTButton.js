import Style from "./Button.module.css";
import React, { useState, useEffect, useContext, useMemo } from "react";
import { Button } from "@chakra-ui/react";
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

export default function SocialMintNFTButton(props) {
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
      const nftAddress = "0x2Bb634109eee5dc71602066f874DA5ABC27be9D8";
      const ERC721_ABI = require("../erc721Abi.json");
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
      );
      const erc721 = new ethers.Contract(nftAddress, ERC721_ABI, provider);
      const txs = [
        {
          to: nftAddress,
          data: erc721.interface.encodeFunctionData("mint", [
            "ipfs://" + props.cid,
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
      // toast(`NFT minted error : ${error}`, {
      //   type: "error",
      // });
      setIsLoading(false);
    }
  }

  const types = ["success", "info", "warning", "error"];

  const addNotification = () => {
    // use a random type of notification
    toast("Lorem ipsum dolor sit amet, consectetur adipiscing elit", {
      type: types[Math.floor(Math.random() * types.length)],
    });
  };

  useEffect(() => {
    if (isLoading) {
      const abi = ["event NftMinted(string cid, address minter)"];

      const alchemyProvider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
      );

      const contractAddress = "0x2Bb634109eee5dc71602066f874DA5ABC27be9D8";

      const contract = new ethers.Contract(
        contractAddress,
        abi,
        alchemyProvider
      );
      if (!isListening) {
        setIsListening(true);
        contract.on("NftMinted", (cid, minter) => {
          console.log(`event NftMinted(${cid}, ${minter}`);
          toast("NFT minted successfully", {
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
            toast(`NFT minting is pending`, {
              type: "default",
            });
            setIsListening(false);
            setIsLoading(true);
            await handleSwitch();
            await executeUserOpAndGasNativeByPaymaster();
          }}
          className={Style.button}
        >
          {isLoading ? "Loading" : "Mint"}
        </button>
      )}
    </div>
  );
}
