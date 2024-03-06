// import Style from "./Button.module.css";
// import React, { useState, useEffect, useRef } from "react";
// import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";

// export default function UpdateListingButton(props) {
//   const [isLoading, setIsLoading] = useState(false);

//   const { config: updateListingConfig } = usePrepareContractWrite({
//     address: props.contractAddress,
//     abi: [
//       {
//         name: "updateListing",
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
//     functionName: "updateListing",
//     args: [props.nftAddress, props.tokenId, props.price, props.tokenUri],
//   });

//   const { writeAsync: updateListingWrite } =
//     useContractWrite(updateListingConfig);

//   async function handleUpdateListing() {
//     try {
//       const res = await updateListingWrite();
//     } catch (error) {
//       console.log(error);
//       setIsLoading(false);
//     }
//   }

//   return (
//     <button
//       onClick={async () => {
//         setIsLoading(true);
//         await handleUpdateListing();
//         setIsLoading(false);
//       }}
//       className={Style.button}
//     >
//       {isLoading ? "Loading" : "Update Price"}
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
const { ethers } = require("ethers");

export default function SocialUpdateListingButton(props) {
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
            [props.nftAddress, props.tokenId, props.price, props.tokenUri]
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

  return (
    <div>
      <button
        onClick={async () => {
          setIsLoading(true);
          await handleSwitch();
          await executeUserOpAndGasNativeByPaymaster();
          setIsLoading(false);
        }}
        className={Style.button}
      >
        {isLoading ? "Loading" : "Social Update"}
      </button>
    </div>
  );
}
