import * as React from "react";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import Style from "./Button.module.css";

export default function SocailMintNFTButton(props) {
  const { config } = usePrepareContractWrite({
    address: props.contractAddress,
    abi: [
      {
        name: "mint",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [{ internalType: "string", name: "tokenUri", type: "string" }],
        outputs: [],
      },
    ],
    functionName: "mint",
    args: ["ipfs://" + props.cid],
  });
  const { write } = useContractWrite(config);

  return (
    <div>
      <button
        disabled={!write}
        onClick={() => write({})}
        className={Style.button}
      >
        Socail Mint
      </button>
    </div>
  );
}
