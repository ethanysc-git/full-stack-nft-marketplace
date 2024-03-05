// import Style from "./Button.module.css";
// import React, { useState, useEffect, useRef, ReactElement } from "react";
// import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
// const { ethers } = require("ethers");

// export default function ListNFTButton(props) {
//   const [approveIsSuccess, setApproveIsSuccess] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const abi = [
//     "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
//   ];

//   const contractAddress = "0x2Bb634109eee5dc71602066f874DA5ABC27be9D8";

//   const alchemyProvider = new ethers.providers.JsonRpcProvider(
//     process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
//   );

//   const contract = new ethers.Contract(contractAddress, abi, alchemyProvider);
//   contract.on("Approval", (owner, approved, tokenId) => {
//     console.log(`event Approval(${owner}, ${approved}, ${tokenId}`);
//     setApproveIsSuccess(true);
//   });

//   async function handleApprove() {
//     try {
//       const { config: approveConfig } = usePrepareContractWrite({
//         address: "0x2Bb634109eee5dc71602066f874DA5ABC27be9D8",

//         abi: [
//           {
//             name: "approve",
//             type: "function",
//             stateMutability: "nonpayable",
//             inputs: [
//               { internalType: "address", name: "to", type: "address" },
//               { internalType: "uint256", name: "tokenId", type: "uint256" },
//             ],
//             outputs: [],
//           },
//         ],
//         functionName: "approve",
//         args: ["0x1c92920ca2445C3c29A9CcC551152317219C61A6", props.tokenId],
//       });

//       const {
//         isLoading,
//         isSuccess,
//         writeAsync: approveWrite,
//       } = useContractWrite(approveConfig);
//       await approveWrite();
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async function handleListItem() {
//     try {
//       const { config: listItemConfig } = usePrepareContractWrite({
//         address: props.contractAddress,
//         abi: [
//           {
//             name: "listItem",
//             type: "function",
//             stateMutability: "nonpayable",
//             inputs: [
//               { internalType: "address", name: "nftAddress", type: "address" },
//               { internalType: "uint256", name: "tokenId", type: "uint256" },
//               { internalType: "uint256", name: "price", type: "uint256" },
//               { internalType: "string", name: "tokenUri", type: "string" },
//             ],
//             outputs: [],
//           },
//         ],
//         functionName: "listItem",
//         args: [props.nftAddress, props.tokenId, props.price, props.tokenUri],
//       });

//       const { writeAsync: listItemWrite } = useContractWrite(listItemConfig);
//       await listItemWrite();
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   useEffect(() => {
//     if (approveIsSuccess) {
//       handleListItem();
//     }
//   }, [approveIsSuccess]);

//   return (
//     <button onClick={() => handleApprove()} className={Style.button}>
//       {isLoading ? "Loading" : "List Item"}
//     </button>
//   );
// }

import Style from "./Button.module.css";
import React, { useState, useEffect, useRef } from "react";
import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
const { ethers } = require("ethers");

export default function ListNFTButton(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [approveIsSuccess, setApproveIsSuccess] = useState(false);
  const [approveIsDone, setApproveIsDone] = useState(false);

  const { config: approveConfig } = usePrepareContractWrite({
    address: "0x2Bb634109eee5dc71602066f874DA5ABC27be9D8",

    abi: [
      {
        name: "approve",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
        ],
        outputs: [],
      },
    ],
    functionName: "approve",
    args: ["0x1c92920ca2445C3c29A9CcC551152317219C61A6", props.tokenId],
  });

  const { isSuccess, writeAsync: approveWrite } =
    useContractWrite(approveConfig);

  async function handleApprove() {
    try {
      approveWrite();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  const { config: listItemConfig } = usePrepareContractWrite({
    address: props.contractAddress,
    abi: [
      {
        name: "listItem",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { internalType: "address", name: "nftAddress", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "uint256", name: "price", type: "uint256" },
          { internalType: "string", name: "tokenUri", type: "string" },
        ],
        outputs: [],
      },
    ],
    functionName: "listItem",
    args: [props.nftAddress, props.tokenId, props.price, props.tokenUri],
  });

  const { write: listItemWrite } = useContractWrite(listItemConfig);

  async function handleListItem() {
    try {
      listItemWrite();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (approveIsSuccess) {
      const abi = [
        "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
      ];

      const alchemyProvider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
      );

      const contractAddress = "0x2Bb634109eee5dc71602066f874DA5ABC27be9D8";

      const contract = new ethers.Contract(
        contractAddress,
        abi,
        alchemyProvider
      );

      contract.on("Approval", (owner, approved, tokenId) => {
        console.log(`event Approval(${owner}, ${approved}, ${tokenId}`);
        setApproveIsDone(true);
      });
    }
  }, [approveIsSuccess]);
  useEffect(() => {
    if (approveIsDone) {
      handleListItem();
    }
  }, [approveIsDone]);
  return (
    <button
      onClick={async () => {
        setIsLoading(true);
        await handleApprove();
        setApproveIsSuccess(true);
      }}
      className={Style.button}
    >
      {isLoading ? "Loading" : "List Item"}
    </button>
  );
}
