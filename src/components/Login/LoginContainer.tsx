import React, { useEffect, useState, FunctionComponent } from "react";
import { View, TextInput } from "react-native";
import { Document } from "@govtechsg/open-attestation";
import { NavigationProps } from "../../types";
import { useDbContext } from "../../context/db";
import { LoadingView } from "../Loading";
import { processQr } from "../../services/QrProcessor";
import { DarkButton } from "../Layout/Buttons/DarkButton";

export const InitialisationContainer: FunctionComponent<NavigationProps> = ({
  navigation
}: NavigationProps) => {
  const [authKey, setAuthKey] = useState("");
  return (
    <View
      style={{
        width: "100%",
        height: "100%"
      }}
    >
      <TextInput
        value={authKey}
        onChange={({ nativeEvent: { text } }) => setAuthKey(text)}
      />
      <DarkButton text="Delete" onPress={() => alert("Hi")} />
    </View>
  );
  // const { db, setDb } = useDbContext();
  // const documentPayload: string | undefined = navigation.getParam("document");
  // const action = reconstructAction({ documentPayload });

  // const onDocumentStore = (document: Document): void => {
  //   navigation.navigate("ValidityCheckScreen", {
  //     document,
  //     savable: true
  //   });
  // };
  // const onDocumentView = (document: Document): void => {
  //   navigation.navigate("ValidityCheckScreen", { document });
  // };

  // const onInitDb = async (): Promise<void> => {
  //   if (!action) {
  //     navigation.navigate("StackNavigator");
  //     return;
  //   }
  //   try {
  //     await processQr(action, {
  //       onDocumentStore,
  //       onDocumentView
  //     });
  //   } catch (e) {
  //     alert(e.message || e);
  //     navigation.navigate("StackNavigator");
  //   }
  // };

  // useEffect(() => {
  //   initialiseDb({
  //     db,
  //     setDb,
  //     onInitDb
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // return <LoadingView />;
};
