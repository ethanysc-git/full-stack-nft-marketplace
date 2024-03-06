import Style from "./NavBar.module.css";
import React, { useState, useEffect, useContext, useMemo } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { MdNotifications } from "react-icons/md";
import { MdOutlineLogin } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import {
  TouristDiscover,
  SocailDiscover,
  Discover,
  About,
  Profile,
  Notification,
} from "./index";
import { Button } from "../componentindex";
import images from "../../img";
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
import { ParticleNetwork, WalletEntryPosition } from "@particle-network/auth";
import { ParticleProvider } from "@particle-network/provider";
import { Ethereum, EthereumSepolia, Polygon } from "@particle-network/chains";
import { ChainId } from "@biconomy/core-types";
import { sepolia, useAccount, useWaitForTransaction } from "wagmi";

const NavBar = () => {
  const { address, isConnected } = useAccount();
  const [discover, setDiscover] = useState(false);
  const [help, setHelp] = useState(false);
  const [notification, setNotification] = useState(false);
  const [profile, setProfile] = useState(false);
  const [_userInfo, set_UserInfo] = useState(null);
  const [caAddress, setCaAddress] = useState(null);
  const [eoaAddress, setEoaAddress] = useState(null);
  const [caBalance, setCaBalance] = useState();
  const { connect, disconnect, connectionStatus } = useConnect();
  const {
    chainId,
    provider,
    sendTransaction,
    signMessage,
    signTypedData,
    switchChain,
  } = useEthereum();
  const [providerState, setProviderState] = useState(null);
  const [loading, setLoading] = useState(false);

  const { userInfo } = useAuthCore();

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

  const fetchBalance = async () => {
    const caAddress = await smartAccount.getAddress();
    const eoaAddress = await smartAccount.getOwner();
    const balance = await customProvider.getBalance(caAddress);
    setCaBalance(ethers.utils.formatEther(balance));
    setCaAddress(caAddress);
    setEoaAddress(eoaAddress);
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      set_UserInfo(null);
      localStorage.removeItem("caAddress");
    } catch (error) {
      console.log(error);
    }
  };

  const openMenu = (e) => {
    const btnText = e.target.innerText;
    if (btnText == "Discover") {
      setDiscover(!discover);
      setHelp(false);
      setNotification(false);
      setProfile(false);
    } else if (btnText == "About") {
      setDiscover(false);
      setHelp(!help);
      setNotification(false);
      setProfile(false);
    } else {
      setDiscover(false);
      setHelp(false);
      setNotification(false);
      setProfile(false);
    }
  };

  const openNotification = () => {
    if (!notification) {
      setNotification(true);
      setDiscover(false);
      setHelp(false);
      setProfile(false);
    } else {
      setNotification(false);
    }
  };
  const openProfile = () => {
    if (!profile) {
      setProfile(true);
      setHelp(false);
      setDiscover(false);
      setNotification(false);
    } else {
      setProfile(false);
    }
  };

  useEffect(() => {
    if (userInfo && !isConnected) {
      set_UserInfo(userInfo);
      fetchBalance();
      localStorage.setItem("caAddress", caAddress);
    } else {
      localStorage.removeItem("caAddress");
    }
    if (isConnected && !userInfo) {
      set_UserInfo(null);
      localStorage.setItem("mataAddress", address);
    }
    {
      localStorage.removeItem("mataAddress");
    }
  }, [userInfo, isConnected]);

  return (
    <div className={Style.navbar}>
      <div className={Style.navbar_container}>
        <div className={Style.navbar_container_left}>
          <div className={Style.logo_icon}>
            <Link href="/" legacyBehavior>
              <Image
                src={images.hero}
                alt="NFT MARKET PLACE LOGO"
                width={120}
                height={120}
              />
            </Link>
          </div>
          {/* <div className={Style.navbar_container_left_box_input}>
            <div className={Style.navbar_container_left_box_input_box}>
              <input type="text" placeholder="Search NFT" />
              <BsSearch onClick={() => {}} className={Style.search_icon} />
            </div>
          </div> */}
        </div>
        {/* end of left section */}
        <div className={Style.navbar_container_right}>
          <div className={Style.navbar_container_right_discover}>
            {/*Discover Menu */}
            <p onClick={(e) => openMenu(e)}>Discover</p>
            {discover && (
              <div className={Style.navbar_container_right_discover_box}>
                <Discover />
              </div>
            )}
          </div>

          {/* About */}
          <div className={Style.navbar_container_right_help}>
            <p onClick={(e) => openMenu(e)}>About</p>
            {help && (
              <div className={Style.navbar_container_right_help_box}>
                <About />
              </div>
            )}
          </div>
          {/* Profile */}
          {connectionStatus === "connected" && (
            <>
              {_userInfo && (
                <div className={Style.navbar_container_right_notify}>
                  <Image
                    priority
                    src={images.hero}
                    alt="Profile"
                    width={80}
                    height={80}
                    onClick={() => openProfile()}
                    className={Style.navbar_container_right_profile}
                  />
                  {profile && (
                    <Profile userName={_userInfo.name} crptoGeek={false} />
                  )}
                </div>
              )}
            </>
          )}

          {isConnected && (
            <>
              {isConnected && (
                <div className={Style.navbar_container_right_notify}>
                  <Image
                    priority
                    src={images.hero}
                    alt="Profile"
                    width={80}
                    height={80}
                    onClick={() => openProfile()}
                    className={Style.navbar_container_right_profile}
                  />
                  {profile && <Profile userName="CrptoGeek" crptoGeek={true} />}
                </div>
              )}
            </>
          )}

          {connectionStatus !== "connected" && !isConnected && (
            <>
              <div className={Style.navbar_container_right_notify}>
                <button
                  className={Style.navbar_container_right_social_connect_button}
                  onClick={handleConnect}
                >
                  {connectionStatus === "disconnected"
                    ? "Social Connect "
                    : connectionStatus.toUpperCase()}
                  <FaUserFriends />
                </button>
              </div>
            </>
          )}

          {connectionStatus === "connected" && (
            <>
              {_userInfo && (
                <div className={Style.navbar_container_right_notify}>
                  <div></div>
                  <button
                    className={
                      Style.navbar_container_right_social_connect_button
                    }
                    onClick={handleDisconnect}
                  >
                    {`${_userInfo.name}  `}
                    <MdOutlineLogin className={Style.notify} />
                  </button>
                </div>
              )}
            </>
          )}
          {/* Connect Wallet botton section */}
          {connectionStatus !== "connected" && (
            <div className={Style.navbar_container_right_notify}>
              <ConnectButton />
            </div>
          )}

          {/* NOTIFICATION */}
          {connectionStatus !== "connected" && isConnected && (
            <div className={Style.navbar_container_right_notify}>
              <MdNotifications
                className={Style.notify}
                onClick={() => openNotification()}
              />
              {notification && <Notification _userInfo={_userInfo} />}
            </div>
          )}
          {connectionStatus == "connected" && !isConnected && (
            <div className={Style.navbar_container_right_notify}>
              <MdNotifications
                className={Style.notify}
                onClick={() => openNotification()}
              />
              {notification && <Notification _userInfo={_userInfo} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
