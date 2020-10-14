import React, { FunctionComponent } from "react";
import { Platform, Linking } from "react-native";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { AlertModal } from "../AlertModal/AlertModal";

export const UpdateFromAppStoreAlert: FunctionComponent = () => {
  let storeName: string;
  let storeLink: string;

  const { i18nt } = useTranslate();

  switch (Platform.OS) {
    case "ios":
      storeName = i18nt("campaignInitialisationScreen", "appleStore");
      storeLink = "https://apps.apple.com/sg/app/supplyally/id1497126533";
      break;

    case "android":
    default:
      // TODO: figure out a better way to handle default if somehow the device is not ios nor android
      storeName = i18nt("campaignInitialisationScreen", "androidStore");
      storeLink =
        "https://play.google.com/store/apps/details?id=sg.gov.tech.musket";
      break;
  }

  return (
    <AlertModal
      alertType="INFO"
      title={i18nt("errorMessages", "outdatedAppUpdate", "title")}
      description={i18nt("errorMessages", "outdatedAppUpdate", "body", {
        storeName: `${storeName}`
      })}
      visible={true}
      buttonTexts={{
        primaryActionText: `${i18nt(
          "errorMessages",
          "outdatedAppUpdate",
          "primaryActionText"
        )}`
      }}
      onOk={() => Linking.openURL(storeLink)}
    />
  );
};
