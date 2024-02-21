import "../styles/globals.css";
import Head from "next/head";
import { NavBar, Footer } from "../components/componentindex";

const MyApp = ({ Component, pageProps }) => (
  <div>
    <Head>
      <title>Dragon Mint Marketplace</title>
      <meta name="description" content="Dragon Mint Marketplace" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/dragonsvg.svg" />
    </Head>

    <NavBar />
    <Component {...pageProps} />
    <Footer />
  </div>
);

export default MyApp;
