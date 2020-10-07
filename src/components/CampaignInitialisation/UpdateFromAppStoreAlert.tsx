import React, { FunctionComponent } from "react";
import { Platform, Linking } from "react-native";
import { AlertModal } from "../AlertModal/AlertModal";
import { getTranslatedStringWithI18n } from "../../utils/translations";

export const UpdateFromAppStoreAlert: FunctionComponent = () => {
  let storeName: string;
  let storeLink: string;
  switch (Platform.OS) {
    case "ios":
      storeName = getTranslatedStringWithI18n(
        "campaignInitialisationScreen",
        "appleStore"
      );
      storeLink = "https://apps.apple.com/sg/app/supplyally/id1497126533";
      break;

    case "android":
    default:
      // TODO: figure out a better way to handle default if somehow the device is not ios nor android
      storeName = getTranslatedStringWithI18n(
        "campaignInitialisationScreen",
        "androidStore"
      );
      storeLink =
        "https://play.google.com/store/apps/details?id=sg.gov.tech.musket";
      break;
  }

  return (
    <AlertModal
      alertType="INFO"
      title={getTranslatedStringWithI18n(
        "errorMessages",
        "outdatedAppUpdate",
        "title"
      )}
      description={getTranslatedStringWithI18n(
        "errorMessages",
        "outdatedAppUpdate",
        "body",
        {
          storeName: `${storeName}`
        }
      )}
      visible={true}
      buttonTexts={{
        primaryActionText: `${getTranslatedStringWithI18n(
          "errorMessages",
          "outdatedAppUpdate",
          "primaryActionText"
        )}`
      }}
      onOk={() => Linking.openURL(storeLink)}
    />
  );
};
