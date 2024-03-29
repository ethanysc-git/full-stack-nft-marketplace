import Style from "./Button.module.css";
import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { Stack, Heading, Text, Button } from "@chakra-ui/react";
import { useAccount, usePrepareContractWrite, useContractWrite } from "wagmi";
import { parseEther, formatEther } from "viem";
import { ToastContainer, toast, TypeOptions } from "react-toastify";
const { ethers } = require("ethers");
import { PromptNFTBox } from "../componentindex";

export default function PromptButton({
  contractAddress,
  prompt,
  // setModel11Output,
  // setModel50Output,
}) {
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [model11IsSuccess, setModel11IsSuccess] = useState(false);
  const [model50IsDone, setModel50IsDone] = useState(false);
  const [model11Output, setModel11Output] = useState("");
  const [model50Output, setModel50Output] = useState("");
  const { config: config50 } = usePrepareContractWrite({
    address: "0xA1773ce3B92c265dCF8dEF22f69a14c2fD00D764",
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
    value: parseEther("0.03"),
  });
  const { writeAsync: calculateAIResultBy50 } = useContractWrite(config50);

  async function handleCalculateAIResultBy50() {
    try {
      await calculateAIResultBy50();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  const { config: config11 } = usePrepareContractWrite({
    address: "0xA1773ce3B92c265dCF8dEF22f69a14c2fD00D764",
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
    value: parseEther("0.05"),
  });
  const { write: calculateAIResultBy11 } = useContractWrite(config11);

  function handleCalculateAIResultBy11() {
    try {
      toast(`Model_11 Prompt is pending`, {
        type: "default",
      });
      calculateAIResultBy11();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (model50IsDone && !model11IsSuccess) {
      const abi = [
        "event Mint2(address indexed to, uint256 indexed requestId, string indexed prompt, uint256 modelId, string output)",
      ];

      const alchemyProvider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
      );

      const contractAddress = "0xA1773ce3B92c265dCF8dEF22f69a14c2fD00D764";

      const contract = new ethers.Contract(
        contractAddress,
        abi,
        alchemyProvider
      );

      contract.on("Mint2", (to, requestId, prompt, modelId, output) => {
        if (to == address && modelId == 50) {
          console.log(
            `event Mint2( requestId : ${requestId}, modelId : ${modelId}, prompt : ${prompt}, output : ${output}, to : ${to}`
          );
          setModel50Output(output);
          toast("Model_50 Prompts Updated successfully", {
            type: "success",
          });
          handleCalculateAIResultBy11();
          setModel11IsSuccess(true);
          setModel50IsDone(false);
        }
      });
    }
  }, [model50IsDone]);

  useEffect(() => {
    if (model11IsSuccess) {
      const abi = [
        "event Mint2(address indexed to, uint256 indexed requestId, string indexed prompt, uint256 modelId, string output)",
      ];

      const alchemyProvider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
      );

      const contractAddress = "0xA1773ce3B92c265dCF8dEF22f69a14c2fD00D764";

      const contract = new ethers.Contract(
        contractAddress,
        abi,
        alchemyProvider
      );

      contract.on("Mint2", (to, requestId, prompt, modelId, output) => {
        if (to == address && modelId == 11) {
          console.log(
            `event Mint2( requestId : ${requestId}, modelId : ${modelId}, prompt : ${prompt}, output : ${output}, to : ${to}`
          );
          setModel11Output(output);
          toast("Model_11 Prompts Updated successfully", {
            type: "success",
          });
          setModel11IsSuccess(false);
          setIsLoading(false);
        }
      });
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
            await handleCalculateAIResultBy50();
            setIsListening(false);
            setIsLoading(true);
            setModel50IsDone(true);
          }}
          className={Style.button}
        >
          {isLoading ? "Loading" : "Prompt"}
        </button>
      )}
      {model50Output.length > 0 && <PromptNFTBox cid={model50Output} />}
      {model11Output.length > 0 && (
        <div>
          <Stack mt="6" spacing="3">
            <Heading size="md">{`${prompt}`}</Heading>
            <Text>{`${model11Output}`}</Text>
          </Stack>
        </div>
      )}
    </div>
  );
}
