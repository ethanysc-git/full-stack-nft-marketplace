import Style from "../../components/HeroSection/HeroSection.module.css";
import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Button,
  Input,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import NFTBox from "../../components/Image/NFTBox";
import CreateNFTButton from "../../components/Button/CreateNFTButton";
import SocialCreateNFTButton from "../../components/Button/SocialCreateNFTButton";
import Create_404_NFTButton from "../../components/Button/Create_404_NFTButton";
import Create_1155_NFTButton from "../../components/Button/Create_1155_NFTButton";
import SocialCreate_404_NFTButton from "../../components/Button/SocialCreate_404_NFTButton";
import SocialCreate_1155_NFTButton from "../../components/Button/SocialCreate_1155_NFTButton";
//
import { useAccount } from "wagmi";
import {
  useConnect,
  useEthereum,
  useAuthCore,
} from "@particle-network/auth-core-modal";

function CreateNFTCollection() {
  const { isConnected } = useAccount();
  const {
    address,
    chainId,
    provider,
    sendTransaction,
    signMessage,
    signTypedData,
    switchChain,
  } = useEthereum();
  const { connect, disconnect, connectionStatus } = useConnect();

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
  const [tabIndex, setTabIndex] = useState(0);

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

  // useEffect(() => {
  //   if (tabIndex) {

  //   }
  // }, [tabIndex]);

  return (
    <div className={Style.heroSection}>
      <Tabs
        className={Style.heroSection_tab}
        onChange={(index) => {
          setTabIndex(index);
          setCollectionNameInput("");
          setCollectionSymbolInput("");
          setCollectionDescriptionInput("");
          setCollectionTotalSupplyInput("");
        }}
      >
        <TabList className={Style.heroSection_tab}>
          <Tab className={Style.heroSection_tab_button}>ERC721</Tab>
          <Tab className={Style.heroSection_tab_button}>ERC404</Tab>
          <Tab className={Style.heroSection_tab_button}>ERC1155</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <h1>CreateNFTCollection_ERC721</h1>
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
                          form.errors.collectionName &&
                          form.touched.collectionName
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

                  {/* {collectionNameInput &&
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
                )} */}

                  {connectionStatus === "connected" && (
                    <>
                      {collectionNameInput &&
                        collectionSymbolInput &&
                        collectionDescriptionInput &&
                        collectionTotalSupplyInput && (
                          <SocialCreateNFTButton
                            contractAddress="0x34Eb633C2f2346979eB89385A2b5fbBa8C9740f4"
                            collectionNameInput={collectionNameInput}
                            collectionSymbolInput={collectionSymbolInput}
                            collectionDescriptionInput={
                              collectionDescriptionInput
                            }
                            collectionTotalSupplyInput={
                              collectionTotalSupplyInput
                            }
                          />
                        )}
                    </>
                  )}

                  {isConnected && (
                    <>
                      {collectionNameInput &&
                        collectionSymbolInput &&
                        collectionDescriptionInput &&
                        collectionTotalSupplyInput && (
                          <CreateNFTButton
                            contractAddress="0x34Eb633C2f2346979eB89385A2b5fbBa8C9740f4"
                            collectionNameInput={collectionNameInput}
                            collectionSymbolInput={collectionSymbolInput}
                            collectionDescriptionInput={
                              collectionDescriptionInput
                            }
                            collectionTotalSupplyInput={
                              collectionTotalSupplyInput
                            }
                          />
                        )}
                    </>
                  )}
                </Form>
              )}
            </Formik>
          </TabPanel>
          <TabPanel>
            <h1>CreateNFTCollection_ERC404</h1>
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
                          form.errors.collectionName &&
                          form.touched.collectionName
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

                  {/* {collectionNameInput &&
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
                )} */}

                  {connectionStatus === "connected" && (
                    <>
                      {collectionNameInput &&
                        collectionSymbolInput &&
                        collectionDescriptionInput &&
                        collectionTotalSupplyInput && (
                          <SocialCreate_404_NFTButton
                            contractAddress="0xB97524e20dC262E9F85334870FD5a2eB76AF4460"
                            collectionNameInput={collectionNameInput}
                            collectionSymbolInput={collectionSymbolInput}
                            collectionDescriptionInput={
                              collectionDescriptionInput
                            }
                            collectionTotalSupplyInput={
                              collectionTotalSupplyInput
                            }
                          />
                        )}
                    </>
                  )}

                  {isConnected && (
                    <>
                      {collectionNameInput &&
                        collectionSymbolInput &&
                        collectionDescriptionInput &&
                        collectionTotalSupplyInput && (
                          <Create_404_NFTButton
                            contractAddress="0x7e0b97091c58fE2c97F7e80eEe88424b9F444dED"
                            collectionNameInput={collectionNameInput}
                            collectionSymbolInput={collectionSymbolInput}
                            collectionDescriptionInput={
                              collectionDescriptionInput
                            }
                            collectionTotalSupplyInput={
                              collectionTotalSupplyInput
                            }
                          />
                        )}
                    </>
                  )}
                </Form>
              )}
            </Formik>
          </TabPanel>
          <TabPanel>
            <h1>CreateNFTCollection_ERC1155</h1>
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
                          form.errors.collectionName &&
                          form.touched.collectionName
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

                  {/* {collectionNameInput &&
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
                )} */}

                  {connectionStatus === "connected" && (
                    <>
                      {collectionNameInput &&
                        collectionSymbolInput &&
                        collectionDescriptionInput &&
                        collectionTotalSupplyInput && (
                          <SocialCreate_1155_NFTButton
                            contractAddress=""
                            collectionNameInput={collectionNameInput}
                            collectionSymbolInput={collectionSymbolInput}
                            collectionDescriptionInput={
                              collectionDescriptionInput
                            }
                            collectionTotalSupplyInput={
                              collectionTotalSupplyInput
                            }
                          />
                        )}
                    </>
                  )}

                  {isConnected && (
                    <>
                      {collectionNameInput &&
                        collectionSymbolInput &&
                        collectionDescriptionInput &&
                        collectionTotalSupplyInput && (
                          <Create_1155_NFTButton
                            contractAddress="0x2CDd43de1E21A92278c8ef10c1cB4d4afb12252a"
                            collectionNameInput={collectionNameInput}
                            collectionSymbolInput={collectionSymbolInput}
                            collectionDescriptionInput={
                              collectionDescriptionInput
                            }
                            collectionTotalSupplyInput={
                              collectionTotalSupplyInput
                            }
                          />
                        )}
                    </>
                  )}
                </Form>
              )}
            </Formik>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

export default CreateNFTCollection;
