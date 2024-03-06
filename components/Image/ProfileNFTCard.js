import Style from "../NavBar//NavBar.module.css";
import React, { useState, useEffect, useContext, useMemo } from "react";
import { useAccount } from "wagmi";
import { parseEther, formatEther } from "viem";
import ListNFTButton from "../Button/ListNFTButton";
import CancelNFTButton from "../Button/CancelNFTButton";
import Image from "next/image";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Divider,
  Button,
  ButtonGroup,
  Stack,
  HStack,
  VStack,
  Text,
  Wrap,
  WrapItem,
  Link,
  ExternalLinkIcon,
  Center,
} from "@chakra-ui/react";

export default function ProfileNFTCard(props) {
  const { isConnected } = useAccount();
  const [imageURI, setImageURI] = useState("");
  async function updateUI() {
    if (props.cid) {
      let cid = props.cid;
      cid = cid.replace("ipfs://", "");
      console.log(`The props.cid is ${props.cid}`);
      const requestURL = "https://ipfs.io/ipfs/" + cid;
      const tokenURIResponse = await (await fetch(requestURL)).json();
      const imageURI = tokenURIResponse.image;
      const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      setImageURI(imageURIURL);
    }
  }

  useEffect(() => {
    updateUI();
  });

  return (
    <div>
      <Card maxW="sm">
        <CardBody>
          <Center>
            {imageURI ? (
              <div>
                <Image
                  priority
                  loader={() => imageURI}
                  src={imageURI}
                  alt="IPFS Image"
                  width={250}
                  height={250}
                  className={Style.navbar_container_right_profile}
                />
              </div>
            ) : (
              <div>Loading...</div>
            )}
          </Center>
          <Stack mt="2" spacing="2">
            <Heading size="md">Token ID : {props.tokenId}</Heading>
            <div>
              <a
                target="_blank"
                rel="noreferrer noopenner"
                href={`https://sepolia.etherscan.io/address/${props.nftAddress}`}
              >
                <Text>NFT Address</Text>
              </a>
            </div>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <ButtonGroup spacing="2">
            {isConnected && (
              <ListNFTButton
                contractAddress="0x1c92920ca2445C3c29A9CcC551152317219C61A6"
                nftAddress={props.nftAddress}
                tokenId={props.tokenId}
                tokenUri={props.cid}
                price={10000000000}
              />
            )}
            {isConnected && (
              <CancelNFTButton
                contractAddress="0x1c92920ca2445C3c29A9CcC551152317219C61A6"
                nftAddress={props.nftAddress}
                tokenId={props.tokenId}
              />
            )}
          </ButtonGroup>
        </CardFooter>
      </Card>
    </div>
  );
}
