import Style from "./Button.module.css";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@chakra-ui/react";
import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import { parseEther, formatEther } from "viem";
import { ToastContainer, toast, TypeOptions } from "react-toastify";
const { ethers } = require("ethers");

export default function PromptButton(props) {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [model11IsSuccess, setModel11IsSuccess] = useState(false);
  const [model50IsDone, setModel50IsDone] = useState(false);
  const [prompt, setPrompt] = useState(props.prompt);
  const { config: config50 } = usePrepareContractWrite({
    address: "0xD61d937E3505d76f5111aCD63c74A09D0Db1ecd3",
    abi: [
      {
        name: "calculateAIResult",
        type: "function",
        stateMutability: "payable",
        inputs: [
          { internalType: "uint256", name: "modelId", type: "uint256" },
          { internalType: "string", name: "prompt", type: "string" },
        ],
        outputs: [],
      },
    ],
    functionName: "calculateAIResult",
    args: [50, prompt],
    from: address,
    value: parseEther("0.025"),
  });
  const { writeAsync: calculateAIResultBy50 } = useContractWrite(config50);

  async function handleCalculateAIResultBy50() {
    try {
      const res = await calculateAIResultBy50();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  const { config: config11 } = usePrepareContractWrite({
    address: "0xD61d937E3505d76f5111aCD63c74A09D0Db1ecd3",
    abi: [
      {
        name: "calculateAIResult",
        type: "function",
        stateMutability: "payable",
        inputs: [
          { internalType: "uint256", name: "modelId", type: "uint256" },
          { internalType: "string", name: "prompt", type: "string" },
        ],
        outputs: [],
      },
    ],
    functionName: "calculateAIResult",
    args: [11, prompt],
    from: address,
    value: parseEther("0.03"),
  });
  const { write: calculateAIResultBy11 } = useContractWrite(config11);

  function handleCalculateAIResultBy11() {
    try {
      toast(`Model_11 Prompt is pending`, {
        type: "default",
      });
      const res = calculateAIResultBy11();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (model50IsDone && !model11IsSuccess) {
      const abi = [
        "event promptsUpdated(uint256 requestId, uint256 modelId, string input, string output, bytes callbackData)",
      ];

      const alchemyProvider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
      );

      const contractAddress = "0xD61d937E3505d76f5111aCD63c74A09D0Db1ecd3";

      const contract = new ethers.Contract(
        contractAddress,
        abi,
        alchemyProvider
      );

      contract.once(
        "promptsUpdated",
        (requestId, modelId, input, output, callbackData) => {
          console.log(
            `event promptsUpdated( requestId : ${requestId}, ${modelId}, ${input}, output : ${output}, ${callbackData}`
          );
          toast("Model_50 Prompts Updated successfully", {
            type: "success",
          });
          handleCalculateAIResultBy11();
          setModel11IsSuccess(true);
          setModel50IsDone(false);
        }
      );
    }
  }, [model50IsDone]);

  useEffect(() => {
    if (model11IsSuccess) {
      const abi = [
        "event promptsUpdated(uint256 requestId, uint256 modelId, string input, string output, bytes callbackData)",
      ];

      const alchemyProvider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
      );

      const contractAddress = "0xD61d937E3505d76f5111aCD63c74A09D0Db1ecd3";

      const contract = new ethers.Contract(
        contractAddress,
        abi,
        alchemyProvider
      );

      contract.once(
        "promptsUpdated",
        (requestId, modelId, input, output, callbackData) => {
          console.log(
            `event promptsUpdated( requestId : ${requestId}, ${modelId}, ${input}, output : ${output}, ${callbackData}`
          );
          toast("Model_11 Prompts Updated successfully", {
            type: "success",
          });
          setModel11IsSuccess(false);
          setIsLoading(false);
        }
      );
    }
  }, [model11IsSuccess]);

  return (
    <div>
      {isLoading && (
        <Button
          isLoading
          loadingText="Loading"
          colorScheme="teal"
          variant="outline"
          spinnerPlacement="end"
          className={Style.button}
        >
          Pending
        </Button>
      )}
      {!isLoading && (
        <button
          disabled={isLoading}
          onClick={async (event) => {
            event.stopPropagation();
            event.preventDefault();
            toast(`Model_50 Prompt is pending`, {
              type: "default",
            });
            const res = await handleCalculateAIResultBy50();
            setIsListening(false);
            setIsLoading(true);
            setModel50IsDone(true);
          }}
          className={Style.button}
        >
          {isLoading ? "Loading" : "Prompt"}
        </button>
      )}
    </div>
  );
}
