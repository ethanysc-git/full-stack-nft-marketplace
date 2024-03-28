import Style from "../components/HeroSection/HeroSection.module.css";
import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { useAccount, useWaitForTransaction } from "wagmi";
import ProfileNFTCard from "../components/Image/ProfileNFTCard";
import { Wrap, WrapItem, Center, Box } from "@chakra-ui/react";
import GET_ACTIVE_ITEMS from "../pages/api/subgraphQueries";
import { useQuery } from "@apollo/client";

function MyCrptoGeekProfile() {
  const [_address, set_Address] = useState(null);
  const { address, isConnected } = useAccount();
  const [userProfiles, setUserProfiles] = useState(null);
  const [listedNftData, setListedNftData] = useState(null);
  const [marketMap, setMarketMap] = useState(null);
  // const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS);

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
        //console.log(finalData);
        setUserProfiles(finalData);
      };
      fetchData();
      set_Address(address);
    }
  }, [address]);

  useEffect(() => {
    if (listedNfts) {
      //setListedNftData(listedNfts);
      data = listedNfts.itemActives;
      marketplaceMap = new Map();
      data.map((nft, index) => {
        const { tokenId } = nft;
        marketplaceMap.set(tokenId, true);
      });
      setMarketMap(marketplaceMap);
    }
  }, [listedNfts]);

  return (
    <div>
      <div className={Style.heroSection}>
        <h1>My Profile</h1>
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
      </div>
    </div>
  );
}

export default MyCrptoGeekProfile;
