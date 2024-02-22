import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import Style from "./Button.module.css";

export default function CancelNFTButton(props) {
  const { address, isConnected } = useAccount();
  const { config } = usePrepareContractWrite({
    address: props.contractAddress,
    abi: [
      {
        name: "cancelListing",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { internalType: "address", name: "nftAddress", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
        ],
        outputs: [],
      },
    ],
    functionName: "cancelListing",
    args: [props.nftAddress, props.tokenId],
  });
  const { write } = useContractWrite(config);

  return (
    <button onClick={() => write({})} className={Style.button}>
      Cancel Listing
    </button>
  );
}
