import { useState, useEffect } from "react";
import Image from "next/image";
import Style from "../NavBar//NavBar.module.css";

function SocailNFTBox({ cid }) {
  const [imageURI, setImageURI] = useState("");

  async function updateUI() {
    if (cid) {
      const imageURIURL = cid.replace("ipfs://", "https://ipfs.io/ipfs/");
      setImageURI(imageURIURL);
    }
  }

  useEffect(() => {
    updateUI();
  });

  return (
    <div>
      {imageURI ? (
        <div>
          <Image
            priority
            loader={() => imageURI}
            src={imageURI}
            alt="IPFS Image"
            width={250}
            height={250}
            className={Style.navbar_container_right_profile}
          />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default SocailNFTBox;
