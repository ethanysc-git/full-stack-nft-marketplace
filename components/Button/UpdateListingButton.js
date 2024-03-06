// /*
//  * @notice Method for updating listing
//  * @param nftAddress Address of NFT contract
//  * @param tokenId Token ID of NFT
//  * @param newPrice Price in Wei of the item
//  */
// function updateListing(
//     address nftAddress,
//     uint256 tokenId,
//     uint256 newPrice,
//     string memory tokenUri
// ) external isListed(nftAddress, tokenId) nonReentrant isOwner(nftAddress, tokenId, msg.sender) {
//     if (newPrice <= 0) {
//         revert PriceMustBeAboveZero();
//     }
//     s_listings[nftAddress][tokenId].price = newPrice;
//     emit ItemListed(msg.sender, nftAddress, tokenId, newPrice, tokenUri);
// }

import Style from "./Button.module.css";
import React, { useState, useEffect, useRef } from "react";
import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";

export default function UpdateListingButton(props) {
  const [isLoading, setIsLoading] = useState(false);

  const { config: updateListingConfig } = usePrepareContractWrite({
    address: props.contractAddress,
    abi: [
      {
        name: "updateListing",
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
    functionName: "updateListing",
    args: [props.nftAddress, props.tokenId, props.price, props.tokenUri],
  });

  const { writeAsync: updateListingWrite } =
    useContractWrite(updateListingConfig);

  async function handleUpdateListing() {
    try {
      const res = await updateListingWrite();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={async () => {
        setIsLoading(true);
        await handleUpdateListing();
        setIsLoading(false);
      }}
      className={Style.button}
    >
      {isLoading ? "Loading" : "Update Price"}
    </button>
  );
}
