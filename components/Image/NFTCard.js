// import Style from "../NavBar//NavBar.module.css";
// import * as React from "react";
// import { useState, useEffect } from "react";
// import { useAccount } from "wagmi";
// import { parseEther, formatEther } from "viem";
// import BuyNFTButton from "../Button/BuyNFTButton";
// import {
//   Card,
//   CardHeader,
//   CardBody,
//   CardFooter,
//   Heading,
//   Divider,
//   Button,
//   ButtonGroup,
//   Stack,
//   HStack,
//   VStack,
//   Image,
//   Text,
//   Wrap,
//   WrapItem,
//   Link,
//   ExternalLinkIcon,
//   Center,
// } from "@chakra-ui/react";
// import images from "../../img";

// export default function NFTCard(props) {
//   const { isConnected } = useAccount();
//   const [imageURI, setImageURI] = useState("");

//   async function updateUI() {
//     if (props.cid) {
//       const requestURL = "https://ipfs.io/ipfs/" + props.cid;
//       const tokenURIResponse = await (await fetch(requestURL)).json();
//       const imageURI = tokenURIResponse.image;
//       const imageURIURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/");
//       setImageURI(imageURIURL);
//     }
//   }

//   useEffect(() => {
//     updateUI();
//   });

//   return (
//     <div className={Style.marketplace}>
//       <Card maxW="sm">
//         <CardBody>
//           <Center>
//             {imageURI ? (
//               <Image src={imageURI} boxSize="250px" />
//             ) : (
//               <div>Loading...</div>
//             )}
//           </Center>
//           <Stack mt="2" spacing="3">
//             <Heading size="md">Token ID : {props.tokenId}</Heading>
//             <div>
//               <a
//                 target="_blank"
//                 rel="noreferrer noopenner"
//                 href={`https://sepolia.etherscan.io/address/${props.nftAddress}`}
//               >
//                 <Text>NFT Address</Text>
//               </a>
//             </div>
//             <div>
//               <a
//                 target="_blank"
//                 rel="noreferrer noopenner"
//                 href={`https://sepolia.etherscan.io/address/${props.seller}`}
//               >
//                 <Text>NFT seller</Text>
//               </a>
//             </div>
//             <div>
//               <Text className="font-sans font-semibold">
//                 Sall price : {formatEther(props.price)}ETH
//               </Text>
//             </div>
//           </Stack>
//         </CardBody>
//         <Divider />
//         <CardFooter>
//           <ButtonGroup spacing="3">
//             {isConnected && (
//               <div>
//                 <BuyNFTButton
//                   contractAddress="0x1c92920ca2445C3c29A9CcC551152317219C61A6"
//                   nftAddress={props.nftAddress}
//                   tokenId={props.tokenId}
//                   price={props.price}
//                 />
//               </div>
//             )}
//           </ButtonGroup>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// }
//
//
//
import Style from "../NavBar//NavBar.module.css";
import * as React from "react";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { parseEther, formatEther } from "viem";
import BuyNFTButton from "../Button/BuyNFTButton";
import SocialBuyNFTButton from "../Button/SocialBuyNFTButton";
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
import {
  useConnect,
  useEthereum,
  useAuthCore,
} from "@particle-network/auth-core-modal";

export default function NFTCard(props) {
  const { isConnected } = useAccount();
  const {
    address,
    chainId,
    provider,
    sendTransaction,
    signMessage,
    signTypedData,
    switchChain,
  } = useEthereum();
  const [imageURI, setImageURI] = useState("");

  async function updateUI() {
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
          <ButtonGroup spacing="3">
            {!address && isConnected && (
              <div>
                <BuyNFTButton
                  contractAddress="0x1c92920ca2445C3c29A9CcC551152317219C61A6"
                  nftAddress={props.nftAddress}
                  tokenId={props.tokenId}
                  price={props.price}
                />
              </div>
            )}
            {address && !isConnected && (
              <div>
                <SocialBuyNFTButton
                  contractAddress="0x1c92920ca2445C3c29A9CcC551152317219C61A6"
                  nftAddress={props.nftAddress}
                  tokenId={props.tokenId}
                  price={props.price}
                />
              </div>
            )}
          </ButtonGroup>
        </CardFooter>
      </Card>
    </div>
  );
}
