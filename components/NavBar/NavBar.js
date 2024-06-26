import Style from "./NavBar.module.css";
import React, { useState, useEffect, useContext, useMemo } from "react";
import { ConnectButton, WalletButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { MdNotifications } from "react-icons/md";
import { MdOutlineLogin } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { FaUserFriends } from "react-icons/fa";
import { Discover, About, Profile, Notification } from "./index";
import images from "../../img";
import {
  useConnect,
  useEthereum,
  useAuthCore,
} from "@particle-network/auth-core-modal";
import { useAccount } from "wagmi";
import NotificationCenter from "../NotificationCenter/NotificationCenter";

const NavBar = () => {
  const { address, isConnected } = useAccount();
  const [discover, setDiscover] = useState(false);
  const [help, setHelp] = useState(false);
  const [notification, setNotification] = useState(false);
  const [profile, setProfile] = useState(false);
  const [_userInfo, set_UserInfo] = useState(null);
  const { connect, disconnect, connectionStatus } = useConnect();
  const { userInfo } = useAuthCore();

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
    }
    if (isConnected && !userInfo) {
      set_UserInfo(null);
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
        </div>
        {/* end of left section */}
        <div className={Style.navbar_container_right}>
          {/*Discover Menu */}
          <div className={Style.navbar_container_right_discover}>
            <p onClick={(e) => openMenu(e)}>Discover</p>
            {discover && (
              <div className={Style.navbar_container_right_discover_box}>
                <Discover />
              </div>
            )}
          </div>

          {/* About */}
          {/* <div className={Style.navbar_container_right_help}>
            <p onClick={(e) => openMenu(e)}>About</p>
            {help && (
              <div className={Style.navbar_container_right_help_box}>
                <About />
              </div>
            )}
          </div> */}

          {/* Profile */}
          {connectionStatus === "connected" && (
            <>
              {_userInfo && (
                <div className={Style.navbar_container_right_notify}>
                  <Image
                    priority
                    src={images.profile}
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
            <div className={Style.navbar_container_right_notify}>
              <Image
                priority
                src={images.profile}
                alt="Profile"
                width={80}
                height={80}
                onClick={() => openProfile()}
                className={Style.navbar_container_right_profile}
              />
              {profile && <Profile userName="CrptoGeek" crptoGeek={true} />}
            </div>
          )}

          <div className={Style.navbar_container_right_notify}>
            {" "}
            {connectionStatus !== "connected" && !isConnected && (
              <>
                <div
                  className={Style.navbar_container_right_notify_connect_button}
                >
                  <button
                    className={
                      Style.navbar_container_right_social_connect_button
                    }
                    onClick={handleConnect}
                  >
                    {connectionStatus === "disconnected"
                      ? "Social Connect "
                      : connectionStatus.toUpperCase()}
                    {/* <FaUserFriends /> */}
                  </button>
                </div>
              </>
            )}
            {connectionStatus === "connected" && (
              <>
                {_userInfo && (
                  <div
                    className={
                      Style.navbar_container_right_notify_connect_button
                    }
                  >
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
              <div
                className={Style.navbar_container_right_notify_connect_button}
              >
                <ConnectButton />
              </div>
            )}
          </div>

          {/* NOTIFICATION */}
          {/* {connectionStatus !== "connected" && isConnected && (
            <div className={Style.navbar_container_right_notify}>
              <div className={Style.notification}>
                <NotificationCenter />
              </div>
            </div>
          )}
          {connectionStatus == "connected" && !isConnected && (
            <div className={Style.navbar_container_right_notify}>
              <div className={Style.notification}>
                <NotificationCenter />
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
