import Style from "../../components/CreateSection/HeroSection.module.css";
import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { Wrap, WrapItem, Center } from "@chakra-ui/react";
import images from "../../img";
import Image from "next/image";
import NFTCard from "../../components/Image/NFTCard";
import { useQuery } from "@apollo/client";
import GET_ACTIVE_ITEMS from "../api/subgraphQueries";
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
  Box,
} from "@chakra-ui/react";

function NFTMarketplace() {
  const [listedNftData, setListedNftData] = useState(null);
  const {
    loading,
    error,
    data: listedNfts,
    startPolling,
    stopPolling,
  } = useQuery(GET_ACTIVE_ITEMS);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    startPolling(2000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  useEffect(() => {
    if (listedNfts) {
      setListedNftData(listedNfts);
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
        <h1>NFT Marketplace</h1>
        <Wrap>
          {loading || !listedNftData ? (
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
                  <Wrap align="center">
                    {listedNftData.itemActives.map((nft, index) => {
                      const { price, nftAddress, tokenId, seller, tokenUri } =
                        nft;
                      let cid = null;
                      if (tokenUri) {
                        cid = tokenUri.replace("ipfs://", "");
                        if (cid) {
                          return (
                            <Box display="flex" key={index} alignItems="center">
                              {cid && (
                                <NFTCard
                                  nftAddress={nftAddress}
                                  tokenId={tokenId}
                                  seller={seller}
                                  price={price}
                                  cid={cid}
                                />
                              )}
                            </Box>
                          );
                        }
                      }
                    })}
                  </Wrap>
                </TabPanel>

                <TabPanel></TabPanel>
              </TabPanels>
            </Tabs>
          )}
        </Wrap>
      </div>
    </div>
  );
}

export default NFTMarketplace;
