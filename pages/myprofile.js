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
import SocialProfileNFTCard from "../components/Image/SocialProfileNFTCard";
import { Wrap, WrapItem, Center } from "@chakra-ui/react";
import GET_ACTIVE_ITEMS from "../pages/api/subgraphQueries";
import { useQuery } from "@apollo/client";

function MyProfile() {
  const [caAddress, setCaAddress] = useState(null);
  const [eoaAddress, setEoaAddress] = useState(null);
  const [caBalance, setCaBalance] = useState();
  const [marketMap, setMarketMap] = useState(null);
  // const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS);
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
        {caAddress && (
          <div>{`Your Social Account Deposit Address : ${caAddress}`}</div>
        )}
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
              }
              let id = profile.token_id + "";
              // console.log(id);
              // console.log(marketMap.get(id));
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
            })
          )}
        </Wrap>
      </div>
    </div>
  );
}

export default MyProfile;

// {
//   token_address: '0x2bb634109eee5dc71602066f874da5abc27be9d8',
//   token_id: '0',
//   amount: '1',
//   token_hash: 'af75f832b815ebf9cf35bfb6d7ecbaa8',
//   block_number_minted: '5212134',
//   contract_type: 'ERC721',
//   name: 'UnitNft',
//   symbol: 'UNFT',
//   token_uri: 'https://ipfs.moralis.io:2053/ipfs/QmTHKFaNqUocBfdotjbDahwdmURjJcPwUuwxyn1sVMehjx',
//   metadata: '{"name":"ipfs_nft","description":"","image":"ipfs://QmWtgG5M7nfu7febnEmaQBsADoCAuUjuKoEv84vqMF75MH","attributes":[{"trait_type":"Cuteness","value":100}]}',
//   last_token_uri_sync: '2024-02-29T15:02:00.039Z',
//   last_metadata_sync: '2024-02-29T15:02:00.192Z',
//   minter_address: '0x1b1432102d127aaeddf9cd97dd744b7384625a72',
//   possible_spam: false,
//   verified_collection: false,
//   media: {
//     status: 'success',
//     updatedAt: '2024-02-29T13:49:31.599Z',
//     mimetype: 'image/jpeg',
//     parent_hash: '0xebe4c34b7b2e424a3286f1f192b3d60e49beb8289658241defc977d1f7d988bb',
//     media_collection: { low: [Object], medium: [Object], high: [Object] },
//     original_media_url: 'ipfs://QmWtgG5M7nfu7febnEmaQBsADoCAuUjuKoEv84vqMF75MH'
//   }
// }
