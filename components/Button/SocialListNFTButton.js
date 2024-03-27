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
import { parseEther, formatEther } from "viem";
import { ToastContainer, toast, TypeOptions } from "react-toastify";
const { ethers } = require("ethers");

export default function SocialListNFTButton(props) {
  const [txHash, setTxHash] = useState(null);
  const [approveIsSuccess, setApproveIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
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

  const alchemyProvider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
  );
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

  async function executeUserOpAndGasNativeByPaymasterApprove() {
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
          data: erc721.interface.encodeFunctionData("approve", [
            props.contractAddress,
            props.tokenId,
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
      setTxHash(txHash);
    } catch (error) {
      console.log(error);
      toast(`Approve NFT error : ${error}`, {
        type: "error",
      });
      setIsLoading(false);
    }
  }

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
          data: dragonMintMarketplace.interface.encodeFunctionData("listItem", [
            props.nftAddress,
            props.tokenId,
            price,
            props.tokenUri,
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
      toast(`List item error : ${error}`, {
        type: "error",
      });
      setIsLoading(false);
    }
  }
  useEffect(() => {
    if (txHash) {
      // const ERC721_ABI = require("../erc721Abi.json");
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
        if (!isListening) {
          setIsListening(true);
          console.log(`event Approval(${owner}, ${approved}, ${tokenId}`);

          toast("Approval successfully", {
            type: "success",
          });
          setApproveIsSuccess(true);
        }
      });
    }
  }, [txHash]);
  useEffect(() => {
    if (approveIsSuccess) {
      setIsListening(false);
      executeUserOpAndGasNativeByPaymaster();
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

      contract.on(
        "ItemListed",
        (seller, nftAddress, tokenId, price, tokenUri) => {
          if (!isListening) {
            setIsListening(true);
            console.log(
              `event ItemListed(${seller}, ${nftAddress}, ${tokenId}, ${price}, ${tokenUri}`
            );
            toast("Item listed successfully", {
              type: "success",
            });
            setIsLoading(false);
          }
        }
      );
    }
  }, [approveIsSuccess]);

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
      <input
        placeholder="Enter Price(ETH)"
        onChange={(e) => {
          setPrice(parseEther(e.target.value));
        }}
      />
      <button
        onClick={async (event) => {
          event.stopPropagation();
          event.preventDefault();
          toast(`Item listed is pending`, {
            type: "default",
          });
          setIsListening(false);
          setIsLoading(true);
          await handleSwitch();
          await executeUserOpAndGasNativeByPaymasterApprove();
        }}
        className={Style.button}
      >
        {isLoading ? "Loading" : "List Item"}
      </button>
    </div>
  );
}
