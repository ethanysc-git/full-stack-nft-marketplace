import { useEffect, useState, useRef } from "react";
import HomeStyle from "../styles/index.module.css";
import Style from "../components/HeroSection/HeroSection.module.css";
//
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Button,
  Input,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import NFTBox from "../components/Image/NFTBox";
import CreateNFTButton from "../components/Button/CreateNFTButton";
//
function CreateNFTCollection() {
  const [file, setFile] = useState("");
  const [cid, setCid] = useState("");
  const [uploading, setUploading] = useState(false);

  const [collectionNameInput, setCollectionNameInput] = useState("");
  const [collectionSymbolInput, setCollectionSymbolInput] = useState("");
  const [collectionDescriptionInput, setCollectionDescriptionInput] =
    useState("");
  const [collectionTotalSupplyInput, setCollectionTotalSupplyInput] =
    useState("");
  const [contractAddress, serContractAddress] = useState("");
  const inputFile = useRef(null);

  const uploadFile = async (fileToUpload) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", fileToUpload, { filename: fileToUpload.name });
      const res = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });
      const ipfsHash = await res.text();
      setCid(ipfsHash);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    uploadFile(e.target.files[0]);
  };

  return (
    <div className={HomeStyle.homePage}>
      <div className={Style.heroSection}>
        <h1>CreateNFTCollection</h1>
        <Formik
          initialValues={{
            collectionName: "",
            collectionSymbol: "",
            collectionDescription: "",
            collectionTotalSupply: "",
          }}
          onSubmit={(values, actions) => {}}
        >
          {(props) => (
            <Form>
              <Field
                name="collectionName"
                validate={(value) => {
                  setCollectionNameInput(value);
                }}
              >
                {({ field, form }) => (
                  <FormControl
                    isRequired
                    isInvalid={
                      form.errors.collectionName && form.touched.collectionName
                    }
                  >
                    <FormLabel>Collection Name</FormLabel>
                    <Input placeholder="" {...field} />
                    <FormErrorMessage>
                      {form.errors.collectionName}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field
                name="collectionSymbol"
                validate={(value) => {
                  setCollectionSymbolInput(value);
                }}
              >
                {({ field, form }) => (
                  <FormControl
                    isRequired
                    isInvalid={
                      form.errors.collectionSymbol &&
                      form.touched.collectionSymbol
                    }
                  >
                    <FormLabel>Collection Symbol</FormLabel>
                    <Input {...field} placeholder="" />
                    <FormErrorMessage>
                      {form.errors.collectionSymbol}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field
                name="collectionDescription"
                validate={(value) => {
                  setCollectionDescriptionInput(value);
                }}
              >
                {({ field, form }) => (
                  <FormControl
                    isRequired
                    isInvalid={
                      form.errors.collectionDescription &&
                      form.touched.collectionDescription
                    }
                  >
                    <FormLabel>Collection Description</FormLabel>
                    <Input {...field} placeholder="" />
                    <FormErrorMessage>
                      {form.errors.collectionDescription}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>

              <Field
                name="collectionTotalSupply"
                validate={(value) => {
                  setCollectionTotalSupplyInput(value);
                }}
              >
                {({ field, form }) => (
                  <FormControl
                    isRequired
                    isInvalid={
                      form.errors.collectionTotalSupply &&
                      form.touched.collectionTotalSupply
                    }
                  >
                    <FormLabel>Collection Size(Total Supply)</FormLabel>
                    <Input {...field} placeholder="" type="number" />

                    <FormErrorMessage>
                      {form.errors.collectionTotalSupply}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              {collectionNameInput &&
                collectionSymbolInput &&
                collectionDescriptionInput &&
                collectionTotalSupplyInput && (
                  <Field name="collectionArtwork">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.collectionArtwork &&
                          form.touched.collectionArtwork
                        }
                      >
                        <FormLabel>
                          Upload your Collection Artwork(optional)
                        </FormLabel>
                        <Input
                          type="file"
                          id="file"
                          ref={inputFile}
                          onChange={handleChange}
                          style={{ display: "none" }}
                        />
                        <div>
                          {cid && <NFTBox cid={cid} />}
                          <button
                            disabled={uploading}
                            onClick={(event) => {
                              event.preventDefault();
                              inputFile.current.click();
                            }}
                          >
                            {uploading ? "Uploading..." : "Upload"}
                          </button>
                        </div>

                        <FormErrorMessage>
                          {form.errors.collectionArtwork}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                )}
              {collectionNameInput &&
                collectionSymbolInput &&
                collectionDescriptionInput &&
                collectionTotalSupplyInput && (
                  <CreateNFTButton
                    contractAddress="0x34Eb633C2f2346979eB89385A2b5fbBa8C9740f4"
                    collectionNameInput={collectionNameInput}
                    collectionSymbolInput={collectionSymbolInput}
                    collectionDescriptionInput={collectionDescriptionInput}
                    collectionTotalSupplyInput={collectionTotalSupplyInput}
                  />
                )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default CreateNFTCollection;
