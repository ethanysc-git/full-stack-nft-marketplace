import Style from './HeroSection.module.css'
import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { useAccount } from "wagmi";
import {
  useConnect,
  useEthereum,
  useAuthCore,
} from "@particle-network/auth-core-modal";
import { Wrap, WrapItem, Center, Box } from "@chakra-ui/react";
import images from "../../img";
import Image from "next/image";
import NFTCard from "../Image/NFTCard";
import { useQuery } from "@apollo/client";
import GET_ACTIVE_ITEMS from "../../pages/api/subgraphQueries";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Button,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
//
import ProfileNFTCard from "../Image/ProfileNFTCard";

const ProfileSection = () => {
  const [_address, set_Address] = useState(null);
  const { address, isConnected } = useAccount();
  const [userProfiles, setUserProfiles] = useState(null);
  const [listedNftData, setListedNftData] = useState(null);
  const [marketMap, setMarketMap] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  const {
    loading,
    error,
    data: listedNfts,
    startPolling,
    stopPolling,
  } = useQuery(GET_ACTIVE_ITEMS);

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

  useEffect(() => {
    startPolling(2000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  useEffect(() => {
    if (address) {
      const fetchData = async () => {
        finalData = {
          data: {
            itemActives: [],
          },
        };

        var jsonData = {};
        jsonData["caAddress"] = address;
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
        finalData = finalData.filter((d) =>
          resMap.set(d.token_id, d.token_uri)
        );
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
      fetchData();
      set_Address(address);
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
                            <Box key={index}>
                              <Center>
                                <WrapItem>
                                  <Center>
                                    <ProfileNFTCard
                                      cid={cid}
                                      tokenId={profile.token_id}
                                      nftAddress="0x2bb634109eee5dc71602066f874da5abc27be9d8"
                                      crptoGeek={true}
                                      listItem={listItem}
                                    />
                                  </Center>
                                </WrapItem>
                              </Center>
                            </Box>
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

export default ProfileSection