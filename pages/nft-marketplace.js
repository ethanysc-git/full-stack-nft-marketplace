import React, { useState, useEffect, useRef } from "react";
import { HeroSection, Service } from "../components/componentindex";
import Style from "../styles/index.module.css";
//
import GET_ACTIVE_ITEMS from "../pages/api/subgraphQueries";
import { useQuery } from "@apollo/client";
import { useAccount, useWaitForTransaction } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import NFTCard from "../components/Image/NFTCard";
import { Wrap, WrapItem, Center } from "@chakra-ui/react";
function NFTMarketplace() {
  const { isConnected, address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS);

  useEffect(() => {
    const fetchData = async () => {
      console.log(`Data : ${listedNfts}`);
    };
    fetchData();
  }, []);

  return (
    <div className={Style.homePage}>
      <h1>NFT Marketplace</h1>
      <div>
        <Wrap>
          {loading || !listedNfts ? (
            <div>Loading...</div>
          ) : (
            listedNfts.itemActives.map((nft, index) => {
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
