import { useState, useEffect } from "react";
import Image from "next/image";
import Style from "../NavBar//NavBar.module.css";

function NFTBox({ cid }) {
  const [imageURI, setImageURI] = useState("");

  async function updateUI() {
    // console.log(`The TokenURI is ipfs://${cid}`);
    if (cid) {
      const requestURL = "https://ipfs.io/ipfs/" + cid;
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

export default NFTBox;
