import Style from './HeroSection.module.css'
import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import {
  useConnect,
  useEthereum,
  useAuthCore,
} from "@particle-network/auth-core-modal";
import { Wrap, WrapItem, Center, Box } from "@chakra-ui/react";
import { useQuery } from "@apollo/client";
import GET_ACTIVE_ITEMS from "../../pages/api/subgraphQueries";
import {
  Code,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
//
import { ethers } from "ethers";
import {
  AAWrapProvider,
  SendTransactionMode,
  SmartAccount,
} from "@particle-network/aa";
import { ChainId } from "@biconomy/core-types";
import SocialProfileNFTCard from "../Image/SocialProfileNFTCard";

const SocialProfileSection = () => {
  const [caAddress, setCaAddress] = useState(null);
  const [eoaAddress, setEoaAddress] = useState(null);
  const [caBalance, setCaBalance] = useState();
  const [marketMap, setMarketMap] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  const {
    loading,
    error,
    data: listedNfts,
    startPolling,
    stopPolling,
  } = useQuery(GET_ACTIVE_ITEMS);
  const {
    address,
    chainId,
    provider,
    sendTransaction,
    signMessage,
    signTypedData,
    switchChain,
  } = useEthereum();
  const [userProfiles, setUserProfiles] = useState(null);
  const [listedNftData, setListedNftData] = useState(null);

  let data = {
    data: {
      itemActives: [],
    },
  };

  let finalData = {
    data: {
      itemActives: [],
    },
  };

  let marketplaceMap = new Map();

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

  const fetchData = async () => {
    finalData = {
      data: {
        itemActives: [],
      },
    };
    const caAddress = await smartAccount.getAddress();
    const eoaAddress = await smartAccount.getOwner();
    const balance = await customProvider.getBalance(caAddress);
    setCaBalance(ethers.utils.formatEther(balance));
    setCaAddress(caAddress);
    setEoaAddress(eoaAddress);

    var jsonData = {};
    jsonData["caAddress"] = caAddress;
    let formData = JSON.stringify(jsonData);
    const res = await fetch("/api/moralis/useEvmWalletNFTs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: formData,
    });
    finalData = await res.json();
    finalData = finalData.result;

    finalData = finalData.filter(
      (d) => d.token_address == "0x2bb634109eee5dc71602066f874da5abc27be9d8"
    );
    let resMap = new Map();
    finalData = finalData.filter((d) => resMap.set(d.token_id, d.token_uri));
    finalData = {
      data: {
        itemActives: [],
      },
    };
    finalData = Array.from(resMap, ([token_id, token_uri]) => ({
      token_id,
      token_uri,
    }));
    // finalData = finalData.sort((a, b) => a.token_id < b.token_id);
    setUserProfiles(finalData);
  };

  useEffect(() => {
    startPolling(2000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  useEffect(() => {
    if (address) {
      fetchData().catch((err) => {
        console.log("error:", err.message);
      });
    }
  }, [address]);

  useEffect(() => {
    if (listedNfts) {
      data = listedNfts.itemActives;
      marketplaceMap = new Map();
      data.map((nft, index) => {
        const { tokenId } = nft;
        marketplaceMap.set(tokenId, true);
      });
      setMarketMap(marketplaceMap);
    }
  }, [listedNfts]);

  useEffect(() => {
    if (tabIndex) {
      if (listedNfts) {
        setListedNftData(listedNfts);
      }
    }
  }, [tabIndex]);

  return (
    <div>
      <div className={Style.heroSection}>
        <h1>My Profile</h1>
        {caAddress && (
          <div><Code>{`Your Social Account Deposit Address : ${caAddress}`}</Code></div>
          
        )}
        <Wrap>
          {loading || !userProfiles ? (
            <div>
              <h2>Loading...</h2>
            </div>
          ) : (
            <Tabs
              className={Style.heroSection_tab}
              onChange={(index) => {
                setTabIndex(index);
              }}
            >
              <TabList mb="5em">
                <Tab
                  className={Style.heroSection_tab_list}
                  _selected={{ color: "white", bg: "blue" }}
                >
                  ERC721
                </Tab>
                <Tab
                  className={Style.heroSection_tab_list}
                  _selected={{ color: "white", bg: "blue" }}
                >
                  ERC7007
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Wrap>
                    {!userProfiles ? (
                      <div>Loading...</div>
                    ) : (
                      userProfiles.map((profile, index) => {
                        let cid = null;
                        let listItem = false;
                        if (profile.token_uri) {
                          cid = profile.token_uri;
                          cid = cid.replace(
                            "https://ipfs.moralis.io:2053/ipfs/",
                            "ipfs://"
                          );
                          let id = profile.token_id + "";
                          if (marketMap.get(id)) {
                            listItem = true;
                          }
                          return (
                            <div key={index}>
                              <Center>
                                <WrapItem>
                                  <Center>
                                    <SocialProfileNFTCard
                                      cid={cid}
                                      tokenId={profile.token_id}
                                      nftAddress="0x2bb634109eee5dc71602066f874da5abc27be9d8"
                                      crptoGeek={true}
                                      listItem={listItem}
                                    />
                                  </Center>
                                </WrapItem>
                              </Center>
                            </div>
                          );
                        }
                      })
                    )}
                  </Wrap>
                </TabPanel>

                <TabPanel></TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </Wrap>
      </div>
    </div>
  )
}

export default SocialProfileSection