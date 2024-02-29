import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import Style from "./Button.module.css";

export default function BuyNFTButton(props) {
  const { address, isConnected } = useAccount();
  const { config } = usePrepareContractWrite({
    address: props.contractAddress,
    abi: [
      {
        name: "buyItem",
        type: "function",
        stateMutability: "payable",
        inputs: [
          { internalType: "address", name: "nftAddress", type: "address" },
          { internalType: "uint256", name: "tokenId", type: "uint256" },
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
