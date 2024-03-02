import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Head from "next/head";
import { NavBar, Footer } from "../components/componentindex";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, sepolia, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

////////////////
import { AuthCoreContextProvider } from "@particle-network/auth-core-modal";
import { Ethereum, EthereumSepolia } from "@particle-network/chains";

////////////////
require("events").EventEmitter.defaultMaxListeners = 50;

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
    <AuthCoreContextProvider
      options={{
        projectId: process.env.NEXT_PUBLIC_REACT_APP_PROJECT_ID,
        clientKey: process.env.NEXT_PUBLIC_REACT_APP_CLIENT_KEY,
        appId: process.env.NEXT_PUBLIC_REACT_APP_APP_ID,
        erc4337: {
          name: "SIMPLE",
          version: "1.0.0",
        },
        wallet: {
          visible: true,
          preload: true,
          themeType: "dark",
          customStyle: {
            supportChains: [
              {
                id: Ethereum.id,
                name: Ethereum.name,
              },
              {
                id: EthereumSepolia.id,
                name: EthereumSepolia.name,
              },
            ],
            supportAddToken: true,

            displayNFTContractAddresses: [
              "0x2Bb634109eee5dc71602066f874DA5ABC27be9D8",
            ],
            priorityNFTContractAddresses: [
              "0x2Bb634109eee5dc71602066f874DA5ABC27be9D8",
            ],
            evmSupportWalletConnect: true,
            supportUIModeSwitch: true,
            supportLanguageSwitch: true,
            light: {
              cancelButtonBackgroundColor: "#9d2626",
              messageColors: ["#000000"],
              modalMaskBackgroundColor: "#212324",
              cardBorderRadius: 20,
            },
            dark: {
              cancelButtonBackgroundColor: "#9d2626",
              messageColors: ["#000000"],
              modalMaskBackgroundColor: "#212324",
              cardBorderRadius: 20,
            },
          },
        },
        themeType: "light",
        authTypes: [
          "email",
          "google",
          "twitter",
          "github",
          "discord",
          "apple",
          "facebook",
        ],
        customStyle: {
          theme: {
            light: {
              themeBackgroundColor: "#83adf3",
              primaryBtnColor: "#c4a468",
              primaryBtnBackgroundColor: "#000000",
              secondaryBtnColor: "#000",
              secondaryBtnBackgroundColor: "#f2f2f2",
              textColor: "#000000",
              secondaryTextColor: "#0a0a5b",
              iconBorderColor: "#1b3c5b",
              accentColor: "#18186b",
              inputBackgroundColor: "#ffffff",
              inputBorderColor: "#000000",
              inputPlaceholderColor: "#86899d",
              cardBorderColor: "#dcdfe6",
              cardUnclickableBackgroundColor: "#e1e1e1",
              cardUnclickableBorderColor: "#eef2f9",
              cardDividerColor: "#000000",
              tagBackgroundColor: "#9fc3e9",
              modalBackgroundColor: "#ffffff",
              tipsBackgroundColor: "#c0825633",
            },
            dark: {
              themeBackgroundColor: "#1c1d22",
              primaryBtnColor: "#000",
              primaryBtnBackgroundColor: "#fff",
              secondaryBtnColor: "#fff",
              secondaryBtnBackgroundColor: "#474747",
              textColor: "#fff",
              secondaryTextColor: "#999999",
              iconBorderColor: "#252525",
              accentColor: "#5177f9",
              inputBackgroundColor: "#2b2b2c",
              inputBorderColor: "#252525",
              inputPlaceholderColor: "#999999",
              cardBorderColor: "#313334",
              cardUnclickableBackgroundColor: "#181818",
              cardUnclickableBorderColor: "#252525",
              cardDividerColor: "#252525",
              tagBackgroundColor: "#202327",
              modalBackgroundColor: "#212324",
              tipsBackgroundColor: "#eab98159",
            },
          },
          logo: "https://raw.githubusercontent.com/ethanysc-git/aa-test/main/public/favicon.ico",
          projectName: "Dragon Mint",
          subtitle: "Login to App to continue",
          modalWidth: 394,
          modalHeight: 650,
          zIndex: 1111111,
          primaryBtnBorderRadius: "20px",
          modalBorderRadius: "20px",
          cardBorderRadius: "20px",
        },
      }}
    >
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <Head>
            <title>Dragon Mint Marketplace</title>
            <meta name="description" content="Dragon Mint Marketplace" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/dragonsvg.svg" />
          </Head>
          <ApolloProvider client={client}>
            <NavBar />
            <Component {...pageProps} />
            <Footer />
          </ApolloProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </AuthCoreContextProvider>
  </div>
);

export default MyApp;
