// import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
// import Style from "./Button.module.css";

// export default function SocailBuyNFTButton(props) {
//   const { address, isConnected } = useAccount();
//   const { config } = usePrepareContractWrite({
//     address: props.contractAddress,
//     abi: [
//       {
//         name: "buyItem",
//         type: "function",
//         stateMutability: "payable",
//         inputs: [
//           { internalType: "address", name: "nftAddress", type: "address" },
//           { internalType: "uint256", name: "tokenId", type: "uint256" },
//         ],
//         outputs: [],
//       },
//     ],
//     functionName: "buyItem",
//     args: [props.nftAddress, props.tokenId],
//     from: address,
//     value: props.price,
//   });
//   const { write } = useContractWrite(config);

//   return (
//     <button
//       onClick={() => async () => {
//         try {
//           write({});
//         } catch (e) {
//           console.log(e)();
//           console.log("trouble loading buyItem")();
//           alert("trouble loading buyItem")();
//         }
//       }}
//       className={Style.button}
//     >
//       Buy now
//     </button>
//   );
// }
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

export default function SocailBuyNFTButton(props) {
  // const [ipfsURL, setIpfsURL] = useState(null);
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
      // particle.setChainInfo({
      //   name: Polygon.name,
      //   id: Polygon.id,
      // });
      // await particle.switchChain(
      //   {
      //     name: Polygon.name,
      //     id: Polygon.id,
      //   },
      //   false
      // );
      // switchChain(Polygon.id);
      switchChain(EthereumSepolia.id);
    } catch (error) {
      console.log(error);
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
    }
  }

  return (
    <div>
      <button
        disabled={!executeUserOpAndGasNativeByPaymaster}
        onClick={async () => {
          await handleSwitch();
          await executeUserOpAndGasNativeByPaymaster();
        }}
        className={Style.button}
      >
        Socail Buy
      </button>
    </div>
  );
}