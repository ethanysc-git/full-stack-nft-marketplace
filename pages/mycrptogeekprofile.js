import Style from "../components/HeroSection/HeroSection.module.css";
import React, { useState, useEffect, useContext, useMemo } from "react";
import { useAccount, useWaitForTransaction } from "wagmi";

function MyCrptoGeekProfile() {
  const [_address, set_Address] = useState(null);
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (address) {
      set_Address(address);
    }
  }, [address]);
  return (
    <div>
      <div className={Style.heroSection}>
        <h1>My CrptoGeek Profile</h1>
        {_address && <div>{`${_address}`}</div>}
      </div>
    </div>
  );
}

export default MyCrptoGeekProfile;
