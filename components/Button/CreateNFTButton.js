import * as React from "react";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import Style from "./Button.module.css";

export default function CreateNFTForm(props) {
  const { config } = usePrepareContractWrite({
    address: props.contractAddress,
    abi: [
      {
        name: "createUnitNft",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [
          { internalType: "string", name: "_tokenName", type: "string" },
          { internalType: "string", name: "_tokenSymbol", type: "string" },
          {
            internalType: "uint256",
            name: "_tokenTotalSupply",
            type: "uint256",
          },
        ],
        outputs: [],
      },
    ],
    functionName: "createUnitNft",
    args: [
      props.collectionNameInput,
      props.collectionSymbolInput,
      props.collectionTotalSupplyInput,
    ],
  });
  const { write } = useContractWrite(config);
  return (
    <div>
      <button
        disabled={!write}
        onClick={() => write({})}
        className={Style.button}
      >
        Create
      </button>
    </div>
  );
}
