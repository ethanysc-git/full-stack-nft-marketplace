// import * as React from "react";
// import { usePrepareContractWrite, useContractWrite } from "wagmi";
// import Style from "./Button.module.css";

// export default function CreateNFTForm(props) {
//   const { config } = usePrepareContractWrite({
//     address: props.contractAddress,
//     abi: [
//       {
//         name: "createUnitNft",
//         type: "function",
//         stateMutability: "nonpayable",
//         inputs: [
//           { internalType: "string", name: "_tokenName", type: "string" },
//           { internalType: "string", name: "_tokenSymbol", type: "string" },
//           {
//             internalType: "uint256",
//             name: "_tokenTotalSupply",
//             type: "uint256",
//           },
//         ],
//         outputs: [],
//       },
//     ],
//     functionName: "createUnitNft",
//     args: [
//       props.collectionNameInput,
//       props.collectionSymbolInput,
//       props.collectionTotalSupplyInput,
//     ],
//   });
//   const { write } = useContractWrite(config);
//   return (
//     <div>
//       <button
//         disabled={!write}
//         onClick={() => write({})}
//         className={Style.button}
//       >
//         Create
//       </button>
//     </div>
//   );
// }
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

export default function SocialCreateNFTButton(props) {
  const [isLoading, setIsLoading] = useState(false);
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
      const nftFactory_ABI = require("../nftFactory.json");
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
        {isLoading ? "Loading" : "Social Create"}
      </button>
    </div>
  );
}
