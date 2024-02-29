import Style from "../components/HeroSection/HeroSection.module.css";
import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { ethers } from "ethers";
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
import { ChainId } from "@biconomy/core-types";

function MyProfile() {
  const [caAddress, setCaAddress] = useState(null);
  const [eoaAddress, setEoaAddress] = useState(null);
  const [caBalance, setCaBalance] = useState();
  const { connect, disconnect, connectionStatus } = useConnect();
  const {
    address,
    chainId,
    provider,
    sendTransaction,
    signMessage,
    signTypedData,
    switchChain,
  } = useEthereum();
  const [selectedProfile, setSelectedProfile] = useState([]);
  const [userProfiles, setUserProfiles] = useState([]);

  let data = {
    data: {
      itemActives: [],
    },
  };

  const originProfiles = useRef();
  originProfiles.current = data;

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

  const customProvider = new ethers.providers.Web3Provider(
    new AAWrapProvider(smartAccount, SendTransactionMode.Gasless),
    "any"
  );

  const fetchBalance = async () => {
    const caAddress = await smartAccount.getAddress();
    const eoaAddress = await smartAccount.getOwner();
    const balance = await customProvider.getBalance(caAddress);
    setCaBalance(ethers.utils.formatEther(balance));
    setCaAddress(caAddress);
    setEoaAddress(eoaAddress);
  };

  useEffect(() => {
    const fetchData = async () => {
      let caAddress = await smartAccount.getAddress();
      caAddress = caAddress.toLowerCase();
      data = {
        data: {
          itemActives: [],
        },
      };
      const formData = new FormData();
      const res = await fetch("/api/moralis/useEvmWalletNFTs", {
        method: "POST",
        body: formData,
      });
      data = await res.json();
      data = data.result;
      data = data.filter((d) => d.to_address == caAddress);
      // data = data.filter(
      //   (d) => d.token_address == "0x2bb634109eee5dc71602066f874da5abc27be9d8"
      // );
      setUserProfiles(data);
      setSelectedProfile(data[0]);
    };
    if (connect) {
      fetchBalance();
      fetchData();
    }
  }, [connect]);
  return (
    <div>
      <div className={Style.heroSection}>
        <h1>My Profile</h1>
        {eoaAddress && <div>{`${eoaAddress}`}</div>}
        {caAddress && <div>{`${caAddress}`}</div>}
        {userProfiles.map((profile, idx) => {
          return <div>{`${profile.token_id} - ${profile.to_address}`}</div>;
        })}
      </div>
    </div>
  );
}

export default MyProfile;
