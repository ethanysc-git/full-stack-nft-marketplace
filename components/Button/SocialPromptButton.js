import Style from "./Button.module.css";
import React, { useState, useEffect } from "react";
import { Stack, Heading, Text, Button } from "@chakra-ui/react";
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
import { EthereumSepolia } from "@particle-network/chains";
import { ChainId } from "@biconomy/core-types";
import { parseEther, formatEther } from "viem";
import { ToastContainer, toast, TypeOptions } from "react-toastify";
const { ethers } = require("ethers");
import { PromptNFTBox } from "../componentindex";

export default function SocialPromptButton(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [caAddress, setCaAddress] = useState(null);
  const {
    address,
    chainId,
    provider,
    sendTransaction,
    signMessage,
    signTypedData,
    switchChain,
  } = useEthereum();
  const [model11, setModel11] = useState("11");
  const [model50, setModel50] = useState("50");
  const model11Fee = "50000000000000000";
  const model50Fee = "30000000000000000";
  const [model11IsSuccess, setModel11IsSuccess] = useState(false);
  const [model50IsDone, setModel50IsDone] = useState(false);
  const [model11Output, setModel11Output] = useState("");
  const [model50Output, setModel50Output] = useState("");

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

  async function executeUserOpAndGasNativeByPaymasterPrompt50() {
    try {
      const promptAddress = "0xA1773ce3B92c265dCF8dEF22f69a14c2fD00D764";
      const Prompt_ABI = require("../prompt.json");
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
      );
      const prompt = new ethers.Contract(promptAddress, Prompt_ABI, provider);
      const txs = [
        {
          to: promptAddress,
          data: prompt.interface.encodeFunctionData("calculateAIResult", [
            model50,
            props.prompt,
          ]),
          value: model50Fee,
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
  async function executeUserOpAndGasNativeByPaymasterPrompt11() {
    try {
      const promptAddress = "0xA1773ce3B92c265dCF8dEF22f69a14c2fD00D764";
      const Prompt_ABI = require("../prompt.json");
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL
      );
      const prompt = new ethers.Contract(promptAddress, Prompt_ABI, provider);
      const txs = [
        {
          to: promptAddress,
          data: prompt.interface.encodeFunctionData("calculateAIResult", [
            model11,
            props.prompt,
          ]),
          value: model11Fee,
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
        if (to == caAddress && modelId == 50) {
          console.log(
            `event Mint2( requestId : ${requestId}, modelId : ${modelId}, prompt : ${prompt}, output : ${output}, to : ${to}`
          );
          setModel50Output(output);
          toast("Model_50 Prompts Updated successfully", {
            type: "success",
          });
          executeUserOpAndGasNativeByPaymasterPrompt11();
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
        if (to == caAddress && modelId == 11) {
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
            setIsLoading(true);
            await handleSwitch();
            const caAddress = await smartAccount.getAddress();
            setCaAddress(caAddress);
            toast(`Model_50 Prompt is pending`, {
              type: "default",
            });
            await executeUserOpAndGasNativeByPaymasterPrompt50();
            setIsListening(false);
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
            <Heading size="md">{`${props.prompt}`}</Heading>
            <Text>{`${model11Output}`}</Text>
          </Stack>
        </div>
      )}
    </div>
  );
}
