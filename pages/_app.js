import "../styles/globals.css";
import Head from "next/head";
import { NavBar, Footer } from "../components/componentindex";
//
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, sepolia, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const { chains, publicClient } = configureChains(
  [sepolia],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
    publicProvider(),
  ]
);
const { connectors } = getDefaultWallets({
  appName: "Dragon Mint",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  chains,
});
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL,
});
const MyApp = ({ Component, pageProps }) => (
  <div>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Head>
          <title>Dragon Mint Marketplace</title>
          <meta name="description" content="Dragon Mint Marketplace" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/dragonsvg.svg" />
        </Head>
        <ApolloProvider client={client}>
          <NavBar />
          <Component {...pageProps} />
          <Footer />
        </ApolloProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </div>
);

export default MyApp;
