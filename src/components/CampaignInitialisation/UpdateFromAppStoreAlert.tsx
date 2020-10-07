import React, { FunctionComponent } from "react";
import { Platform, Linking } from "react-native";
import { AlertModal } from "../AlertModal/AlertModal";
import { i18nString, i18nErrorString } from "../../utils/i18nString";

export const UpdateFromAppStoreAlert: FunctionComponent = () => {
  let storeName: string;
  let storeLink: string;
  switch (Platform.OS) {
    case "ios":
      storeName = i18nString("campaignInitialisationScreen", "appleStore");
      storeLink = "https://apps.apple.com/sg/app/supplyally/id1497126533";
      break;

    case "android":
    default:
      // TODO: figure out a better way to handle default if somehow the device is not ios nor android
      storeName = i18nString("campaignInitialisationScreen", "androidStore");
      storeLink =
        "https://play.google.com/store/apps/details?id=sg.gov.tech.musket";
      break;
  }

  return (
    <AlertModal
      alertType="INFO"
      title={i18nErrorString("outdatedAppUpdate", "title")}
      description={i18nErrorString("outdatedAppUpdate", "body", {
        storeName: `${storeName}`
      })}
      visible={true}
      buttonTexts={{
        primaryActionText: `${i18nErrorString(
          "outdatedAppUpdate",
          "primaryActionText"
        )}`
      }}
      onOk={() => Linking.openURL(storeLink)}
    />
  );
};
