import Style from './HeroSection.module.css'
import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import Image from 'next/image'
import images from "../../img"
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
import CreateNFTButton from "../Button/CreateNFTButton";
import SocialCreateNFTButton from "../Button/SocialCreateNFTButton";
import { useAccount } from "wagmi";
import {
  useConnect,
  useEthereum,
  useAuthCore,
} from "@particle-network/auth-core-modal";

const CreateSection = () => {
  const { isConnected } = useAccount();
  const { connect, disconnect, connectionStatus } = useConnect();

  const [collectionNameInput, setCollectionNameInput] = useState("");
  const [collectionSymbolInput, setCollectionSymbolInput] = useState("");
  const [collectionDescriptionInput, setCollectionDescriptionInput] =
    useState("");
  const [collectionTotalSupplyInput, setCollectionTotalSupplyInput] =
    useState("");
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <div className={Style.heroSection_home_page}>
      <div className={Style.heroSection_box}>
      <div className={Style.heroSection_box_left}>
        <h1>Discover, Collect and Create NFT</h1>
          <p>
            Upload your photo below and mint your own NFT.
          </p> 
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
        <TabList>
          <Tab className={Style.heroSection_tab_list} _selected={{ color: "white", bg: "blue" }}>ERC721</Tab>
          <Tab className={Style.heroSection_tab_list} _selected={{ color: "white", bg: "blue" }}>ERC7007</Tab>
        </TabList>
        <TabPanels>
              
          <TabPanel>
            <h2>ERC721</h2>
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
                        <Input className={Style.heroSection_tab_input_box} placeholder="" {...field} />
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
                        <Input className={Style.heroSection_tab_input_box} {...field} placeholder="" />
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
                        <Input className={Style.heroSection_tab_input_box} {...field} placeholder="" />
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
                        <Input className={Style.heroSection_tab_input_box} {...field} placeholder="" type="number" />

                        <FormErrorMessage>
                          {form.errors.collectionTotalSupply}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>



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
            <h2>ERC7007</h2>
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
                        <Input className={Style.heroSection_tab_input_box} placeholder="" {...field} />
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
                        <Input className={Style.heroSection_tab_input_box}  {...field} placeholder="" />
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
                        <Input className={Style.heroSection_tab_input_box} {...field} placeholder="" />
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
                        <Input className={Style.heroSection_tab_input_box} {...field} placeholder="" type="number" />

                        <FormErrorMessage>
                          {form.errors.collectionTotalSupply}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>



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

        </TabPanels>
        </Tabs>     
      </div>
      <div className={Style.heroSection_box_right}>
              <Image
              priority
              src={images.watercolorwolfclipart}
              alt='Create Section'
              className={Style.heroSection_image_right}
              />
      </div>
      </div>
    </div>
  )
}

export default CreateSection