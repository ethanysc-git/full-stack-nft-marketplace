import Style from "../NavBar//NavBar.module.css";
import React, { useState, useEffect, useContext, useMemo } from "react";
import { useAccount } from "wagmi";
import { parseEther, formatEther } from "viem";
import ListNFTButton from "../Button/ListNFTButton";
import CancelNFTButton from "../Button/CancelNFTButton";
import TransferNFTButton from "../Button/TransferNFTButton";
import UpdateListingButton from "../Button/UpdateListingButton";
import Image from "next/image";
import images from "../../img";
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
  Center,
} from "@chakra-ui/react";

export default function ProfileNFTCard(props) {
  const [isList, setIsList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected } = useAccount();
  const [imageURI, setImageURI] = useState("");
  async function updateUI() {
    if (props.cid) {
      let cid = props.cid;
      cid = cid.replace("ipfs://", "");
      //console.log(`The props.cid is ${props.cid}`);
      const requestURL = "https://ipfs.io/ipfs/" + cid;
      const tokenURIResponse = await (await fetch(requestURL)).json();
      const imageURI = tokenURIResponse.image;
      const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      setImageURI(imageURIURL);
    }
    if (props.listItem) {
      console.log(`props.listItem : ${props.listItem}`);
      setIsList(true);
    }
  }

  useEffect(() => {
    updateUI();
  });

  return (
    <div className={Style.profile}>
      <Card maxW="sm" p={2} customVariant="border">
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
          <ButtonGroup spacing="3">
            {isLoading && (
              <>
                <Image
                  src={images.snailloading}
                  alt="Loading logo"
                  width={80}
                  height={80}
                />
                <p>{isLoading ? "Loading" : ""}</p>
              </>
            )}
            {isConnected && !isList && (
              <ListNFTButton
                contractAddress="0x1c92920ca2445C3c29A9CcC551152317219C61A6"
                nftAddress={props.nftAddress}
                tokenId={props.tokenId}
                tokenUri={props.cid}
              />
            )}
            {isConnected && isList && (
              <UpdateListingButton
                contractAddress="0x1c92920ca2445C3c29A9CcC551152317219C61A6"
                nftAddress={props.nftAddress}
                tokenId={props.tokenId}
                tokenUri={props.cid}
              />
            )}
            {isConnected && isList && (
              <CancelNFTButton
                contractAddress="0x1c92920ca2445C3c29A9CcC551152317219C61A6"
                nftAddress={props.nftAddress}
                tokenId={props.tokenId}
              />
            )}
            {isConnected && !isList && (
              <TransferNFTButton
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
