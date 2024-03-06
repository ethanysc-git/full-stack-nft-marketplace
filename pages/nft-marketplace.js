import React, { useState, useEffect, useRef } from "react";
import Style from "../components/HeroSection/HeroSection.module.css";
import GET_ACTIVE_ITEMS from "../pages/api/subgraphQueries";
import { useQuery } from "@apollo/client";
import NFTCard from "../components/Image/NFTCard";
import { Wrap, WrapItem, Center } from "@chakra-ui/react";

function NFTMarketplace() {
  const [listedNftData, setListedNftData] = useState(null);
  const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS);

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
              const cid = tokenUri.replace("ipfs://", "");
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
                            marketplaceUI={true}
                            profileUI={false}
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
