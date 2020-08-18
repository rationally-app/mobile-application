import React, { FunctionComponent } from "react";
import { Platform, Linking } from "react-native";
import { AlertModal } from "../AlertModal/AlertModal";

export const UpdateFromAppStoreAlert: FunctionComponent = () => {
  let storeName: string;
  let storeLink: string;
  switch (Platform.OS) {
    case "ios":
      storeName = "App Store";
      storeLink = "https://apps.apple.com/sg/app/supplyally/id1497126533";
      break;

    case "android":
    default:
      // TODO: figure out a better way to handle default if somehow the device is not ios nor android
      storeName = "Play Store";
      storeLink =
        "https://play.google.com/store/apps/details?id=sg.gov.tech.musket";
      break;
  }

  return (
    <AlertModal
      alertType="INFO"
      title="Outdated app"
      description={`Update your app through the ${storeName}.`}
      visible={true}
      buttonTexts={{ primaryActionText: "Update app" }}
      onOk={() => Linking.openURL(storeLink)}
    />
  );
};
