import Style from "../NavBar//NavBar.module.css";
import * as React from "react";
import { useState, useEffect } from "react";
import { parseEther, formatEther } from "viem";
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
  Image,
  Text,
  Wrap,
  WrapItem,
  Link,
  ExternalLinkIcon,
  Center,
} from "@chakra-ui/react";
import images from "../../img";

export default function TouristNFTCard(props) {
  const [imageURI, setImageURI] = useState("");

  async function updateUI() {
    console.log(`The TokenURI is ipfs://${props.cid}`);
    if (props.cid) {
      const requestURL = "https://ipfs.io/ipfs/" + props.cid;
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
    <div className={Style.marketplace}>
      <Card maxW="sm">
        <CardBody>
          <Center>
            {imageURI ? (
              <Image src={imageURI} boxSize="250px" />
            ) : (
              <div>Loading...</div>
            )}
          </Center>
          <Stack mt="2" spacing="3">
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
            <div>
              <a
                target="_blank"
                rel="noreferrer noopenner"
                href={`https://sepolia.etherscan.io/address/${props.seller}`}
              >
                <Text>NFT seller</Text>
              </a>
            </div>
            <div>
              <Text className="font-sans font-semibold">
                Sall price : {formatEther(props.price)}ETH
              </Text>
            </div>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <ButtonGroup spacing="3"></ButtonGroup>
        </CardFooter>
      </Card>
    </div>
  );
}
