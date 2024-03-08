// import Style from "./Button.module.css";
// import React, { useState, useEffect, useRef } from "react";
// import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";

// export default function ListNFTButton(props) {
//   const { config: approveConfig } = usePrepareContractWrite({
//     address: "0x2Bb634109eee5dc71602066f874DA5ABC27be9D8",

//     abi: [
//       {
//         name: "approve",
//         type: "function",
//         stateMutability: "nonpayable",
//         inputs: [
//           { internalType: "address", name: "to", type: "address" },
//           { internalType: "uint256", name: "tokenId", type: "uint256" },
//         ],
//         outputs: [],
//       },
//     ],
//     functionName: "approve",
//     args: ["0x1c92920ca2445C3c29A9CcC551152317219C61A6", props.tokenId],
//   });

//   const {
//     isLoading: approveIsLoading,
//     isSuccess: approveIsSuccess,
//     write: approveWrite,
//   } = useContractWrite(approveConfig);

//   const { config: listItemConfig } = usePrepareContractWrite({
//     address: props.contractAddress,
//     abi: [
//       {
//         name: "listItem",
//         type: "function",
//         stateMutability: "nonpayable",
//         inputs: [
//           { internalType: "address", name: "nftAddress", type: "address" },
//           { internalType: "uint256", name: "tokenId", type: "uint256" },
//           { internalType: "uint256", name: "price", type: "uint256" },
//           { internalType: "string", name: "tokenUri", type: "string" },
//         ],
//         outputs: [],
//       },
//     ],
//     functionName: "listItem",
//     args: [props.nftAddress, props.tokenId, props.price, props.tokenUri],
//   });

//   const { write: listItemWrite } = useContractWrite(listItemConfig);

//   useEffect(() => {
//     if (approveIsSuccess) {
//       listItemWrite();
//     }
//   }, [approveIsLoading, approveIsSuccess, listItemWrite]);
//   return (
//     <button onClick={() => approveWrite({})} className={Style.button}>
//       {approveIsLoading ? "Loading" : "List Item"}
//     </button>
//   );
// }
//
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
const { ethers } = require("ethers");

export default function SocialListNFTButton(props) {
  const [txHash, setTxHash] = useState(null);
  const [approveIsSuccess, setApproveIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
            props.price,
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
        console.log(`event Approval(${owner}, ${approved}, ${tokenId}`);
        setApproveIsSuccess(true);
      });
    }
  }, [txHash]);
  useEffect(() => {
    if (approveIsSuccess) {
      executeUserOpAndGasNativeByPaymaster();
      setIsLoading(false);
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
      <input placeholder="Enter Price(ETH)" />
      <button
        disabled={isLoading}
        onClick={async () => {
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
