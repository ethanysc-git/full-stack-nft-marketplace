import Style from "../components/HeroSection/HeroSection.module.css";
import React, { useState, useEffect, useRef } from "react";
import { Wrap, WrapItem, Center } from "@chakra-ui/react";
import NFTCard from "../components/Image/NFTCard";
import { useQuery } from "@apollo/client";
import GET_ACTIVE_ITEMS from "../pages/api/subgraphQueries";

function NFTMarketplace() {
  const [listedNftData, setListedNftData] = useState(null);
  const {
    loading,
    error,
    data: listedNfts,
    startPolling,
    stopPolling,
  } = useQuery(GET_ACTIVE_ITEMS);

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

  return (
    <div>
      <div className={Style.heroSection}>
        <h1>NFT Marketplace</h1>
        <Wrap>
          {loading || !listedNftData ? (
            <div>Loading...</div>
          ) : (
            listedNftData.itemActives.map((nft, index) => {
              const { price, nftAddress, tokenId, seller, tokenUri } = nft;
              let cid = null;
              if (tokenUri) {
                cid = tokenUri.replace("ipfs://", "");
              }
              return (
                <div key={index}>
                  <Center>
                    <WrapItem>
                      <Center>
                        {cid && (
                          <NFTCard
                            nftAddress={nftAddress}
                            tokenId={tokenId}
                            seller={seller}
                            price={price}
                            cid={cid}
                          />
                        )}
                      </Center>
                    </WrapItem>
                  </Center>
                </div>
              );
            })
          )}
        </Wrap>
      </div>
    </div>
  );
}

export default NFTMarketplace;
