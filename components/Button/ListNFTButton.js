import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import Style from "./Button.module.css";

//   /*
//    * @notice Method for listing NFT
//    * @param nftAddress Address of NFT contract
//    * @param tokenId Token ID of NFT
//    * @param price sale price for each item
//    */
//   function listItem(
//     address nftAddress,
//     uint256 tokenId,
//     uint256 price,
//     string memory tokenUri
// ) external notListed(nftAddress, tokenId) isOwner(nftAddress, tokenId, msg.sender) {
//     if (price <= 0) {
//         revert PriceMustBeAboveZero();
//     }
//     IERC721 nft = IERC721(nftAddress);
//     if (nft.getApproved(tokenId) != address(this)) {
//         revert NotApprovedForMarketplace();
//     }
//     s_listings[nftAddress][tokenId] = Listing(price, msg.sender);
//     emit ItemListed(msg.sender, nftAddress, tokenId, price, tokenUri);
// }

export default function BuyNFTButton(props) {
  const { address, isConnected } = useAccount();
  const { config } = usePrepareContractWrite({
    address: props.contractAddress,
    abi: [
      {
        name: "listItem",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { internalType: "address", name: "nftAddress", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "address", name: "nftAddress", type: "address" },
          { internalType: "string", name: "tokenUri", type: "string" },
        ],
        outputs: [],
      },
    ],
    functionName: "buyItem",
    args: [props.nftAddress, props.tokenId],
    from: address,
    value: props.price,
  });
  const { write } = useContractWrite(config);

  return (
    <button
      onClick={() => async () => {
        try {
          write({});
        } catch (e) {
          console.log(e)();
          console.log("trouble loading buyItem")();
          alert("trouble loading buyItem")();
        }
      }}
      className={Style.button}
    >
      Buy now
    </button>
  );
}
