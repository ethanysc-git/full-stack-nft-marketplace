import Style from "../components/HeroSection/HeroSection.module.css";
import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { useAccount, useWaitForTransaction } from "wagmi";
import ProfileNFTCard from "../components/Image/ProfileNFTCard";
import { Wrap, WrapItem, Center } from "@chakra-ui/react";

function MyCrptoGeekProfile() {
  const [_address, set_Address] = useState(null);
  const { address, isConnected } = useAccount();
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
        setUserProfiles(finalData);
      };
      fetchData();
      set_Address(address);
    }
  }, [address]);
  return (
    <div>
      <div className={Style.heroSection}>
        <h1>My Profile</h1>
        <Wrap>
          {!userProfiles ? (
            <div>Loading...</div>
          ) : (
            userProfiles.map((profile, index) => {
              let cid = profile.token_uri;
              cid = cid.replace(
                "https://ipfs.moralis.io:2053/ipfs/",
                "ipfs://"
              );
              return (
                <div key={index}>
                  <Center>
                    <WrapItem>
                      <Center>
                        <ProfileNFTCard
                          cid={cid}
                          tokenId={profile.token_id}
                          nftAddress="0x2bb634109eee5dc71602066f874da5abc27be9d8"
                          crptoGeek={true}
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

export default MyCrptoGeekProfile;

// import Style from "../components/HeroSection/HeroSection.module.css";
// import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
// import { useAccount, useWaitForTransaction } from "wagmi";
// import ProfileNFTCard from "../components/Image/ProfileNFTCard";
// import { Wrap, WrapItem, Center } from "@chakra-ui/react";

// function MyCrptoGeekProfile() {
//   const [userProfiles, setUserProfiles] = useState(null);
//   const [_address, set_Address] = useState(null);
//   const { address, isConnected } = useAccount();

//   let data = {
//     data: {
//       itemActives: [],
//     },
//   };
//   let finalData = {
//     data: {
//       itemActives: [],
//     },
//   };

//   const originProfiles = useRef();
//   originProfiles.current = data;

//   useEffect(async () => {
//     if (!userProfiles) {
//       const fetchData = async () => {
//         finalData = {
//           data: {
//             itemActives: [],
//           },
//         };

//         var jsonData = {};
//         jsonData["caAddress"] = address;
//         let formData = JSON.stringify(jsonData);
//         const res = await fetch("/api/moralis/useEvmWalletNFTs", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: formData,
//         });
//         finalData = await res.json();
//         finalData = finalData.result;

//         finalData = finalData.filter(
//           (d) => d.token_address == "0x2bb634109eee5dc71602066f874da5abc27be9d8"
//         );
//         let resMap = new Map();
//         finalData = finalData.filter((d) =>
//           resMap.set(d.token_id, d.token_uri)
//         );
//         finalData = {
//           data: {
//             itemActives: [],
//           },
//         };
//         finalData = Array.from(resMap, ([token_id, token_uri]) => ({
//           token_id,
//           token_uri,
//         }));
//         setUserProfiles(finalData);
//       };
//       await fetchData();

//       set_Address(address);
//     }
//   }, [_address]);

//   return (
//     <div>
//       <div className={Style.heroSection}>
//         <h1>My Profile</h1>
//         <Wrap>
//           {!userProfiles ? (
//             <div>Loading...</div>
//           ) : (
//             userProfiles.map((profile, index) => {
//               let cid = profile.token_uri;
//               cid = cid.replace(
//                 "https://ipfs.moralis.io:2053/ipfs/",
//                 "ipfs://"
//               );
//               return (
//                 <div key={index}>
//                   <Center>
//                     <WrapItem>
//                       <Center>
//                         <ProfileNFTCard
//                           cid={cid}
//                           tokenId={profile.token_id}
//                           nftAddress="0x2bb634109eee5dc71602066f874da5abc27be9d8"
//                           crptoGeek={true}
//                         />
//                       </Center>
//                     </WrapItem>
//                   </Center>
//                 </div>
//               );
//             })
//           )}
//         </Wrap>
//       </div>
//     </div>
//   );
// }

// export default MyCrptoGeekProfile;
