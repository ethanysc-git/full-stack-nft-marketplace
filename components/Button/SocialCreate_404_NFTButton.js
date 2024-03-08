// import Style from "./Button.module.css";
// import React, { useState, useEffect, useRef } from "react";
// import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
// import images from "../../img";
// import Image from "next/image";
// const { ethers } = require("ethers");

// export default function SocialCreate_404_NFTButton(props) {
//   //   contract GradientCircleFactory {
//   //     mapping(address => address) public getPair;

//   //     event ContractCreated(address gradientCircleAddr);

//   //     function createGradientCircle(
//   //         address _contractOwner,
//   //         address _initialTokenOwner,
//   //         string memory _tokenName,
//   //         string memory _tokenSymbol
//   //     ) external returns (address gradientCircleAddr) {
//   //         bytes32 salt = keccak256(abi.encodePacked(_tokenName, _tokenSymbol));

//   //         GradientCircle gc = new GradientCircle{salt: salt}(_contractOwner, _initialTokenOwner);

//   //         gc.setNameSymbol(_tokenName, _tokenSymbol);

//   //         gradientCircleAddr = address(gc);
//   //         getPair[gradientCircleAddr] = msg.sender;
//   //         emit ContractCreated(gradientCircleAddr);
//   //     }
//   // }

//   const { address, isConnected } = useAccount();
//   const [isLoading, setIsLoading] = useState(false);
//   const { config } = usePrepareContractWrite({
//     address: props.contractAddress,
//     abi: [
//       {
//         name: "createGradientCircle",
//         type: "function",
//         stateMutability: "nonpayable",
//         inputs: [
//           { internalType: "address", name: "_contractOwner", type: "address" },
//           {
//             internalType: "address",
//             name: "_initialTokenOwner",
//             type: "address",
//           },
//           { internalType: "string", name: "_tokenName", type: "string" },
//           { internalType: "string", name: "_tokenSymbol", type: "string" },
//         ],
//         outputs: [],
//       },
//     ],
//     functionName: "createGradientCircle",
//     args: [
//       address,
//       address,
//       props.collectionNameInput,
//       props.collectionSymbolInput,
//     ],
//   });

//   const { writeAsync: create_404_NftWrite } = useContractWrite(config);

//   async function handleCreate_404_NftWrite() {
//     try {
//       const res = await create_404_NftWrite();
//     } catch (error) {
//       console.log(error);
//       setIsLoading(false);
//     }
//   }

//   return (
//     <div>
//       {isLoading && (
//         <>
//           <Image
//             src={images.snailloading}
//             alt="Loading logo"
//             width={80}
//             height={80}
//           />
//           <p>{isLoading ? "Loading" : ""}</p>
//         </>
//       )}
//       {!isLoading && (
//         <button
//           disabled={isLoading}
//           onClick={async () => {
//             setIsLoading(true);
//             await handleCreate_404_NftWrite();
//             setIsLoading(false);
//           }}
//           className={Style.button}
//         >
//           {isLoading ? "Loading" : "Create"}
//         </button>
//       )}
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
import images from "../../img";
import Image from "next/image";
const { ethers } = require("ethers");

export default function SocialCreate_404_NFTButton(props) {
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
  //
  // event ContractCreated(address GradientColorAddr);

  // function createGradientColor(
  //     address _contractOwner,
  //     address _initialTokenOwner,
  //     string memory _tokenName,
  //     string memory _tokenSymbol
  // ) external returns (address GradientColorAddr) {
  //     bytes32 salt = keccak256(abi.encodePacked(_tokenName, _tokenSymbol));

  //     GradientColor gc = new GradientColor{salt: salt}(
  //         _contractOwner,
  //         _initialTokenOwner,
  //         _tokenName,
  //         _tokenSymbol
  //     );

  //     //gc.setNameSymbol(_tokenName, _tokenSymbol);

  //     GradientColorAddr = address(gc);
  //     getPair[GradientColorAddr] = msg.sender;
  //     emit ContractCreated(GradientColorAddr);
  // }
  //
  async function executeUserOpAndGasNativeByPaymaster() {
    try {
      const nftFactoryAddress = "0x7e0b97091c58fE2c97F7e80eEe88424b9F444dED";
      const nftFactory_ABI = require("../unitNFT_404_Factory.json");
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
          data: nftFactory.interface.encodeFunctionData("createGradientColor", [
            address,
            address,
            props.collectionNameInput,
            props.collectionSymbolInput,
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
        onClick={async () => {
          setIsLoading(true);
          await handleSwitch();
          await executeUserOpAndGasNativeByPaymaster();
          setIsLoading(false);
        }}
        className={Style.button}
      >
        {isLoading ? "Loading" : "Create"}
      </button>
    </div>
  );
}
