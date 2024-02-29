import Moralis from "moralis";

let allNFTs = [];

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      if (!Moralis.Core.isStarted) {
        await Moralis.start({
          apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
        });
      }

      // Moralis.EvmApi.nft.getWalletNFTs
      // Moralis.EvmApi.nft.getNFTOwners
      // Moralis.EvmApi.nft.getContractNFTs
      // Moralis.EvmApi.nft.getNFTContractTransfers

      // chain: "0xaa36a7",
      // format: "decimal",
      // mediaItems: true,
      // address: "0x2Bb634109eee5dc71602066f874DA5ABC27be9D8",

      const response = await Moralis.EvmApi.nft.getNFTContractTransfers({
        chain: "0xaa36a7",
        format: "decimal",
        order: "DESC",
        address: "0x2Bb634109eee5dc71602066f874DA5ABC27be9D8",
      });

      // response.raw.result.map((profile, idx) => {});
      allNFTs.push(...response.jsonResponse.result);
      console.log(allNFTs[0]);
      return res.json({ result: allNFTs });
    } catch (e) {
      console.error(e);
    }
  } else if (req.method === "GET") {
    try {
    } catch (error) {
      console.log(error);
    }
  }
}
