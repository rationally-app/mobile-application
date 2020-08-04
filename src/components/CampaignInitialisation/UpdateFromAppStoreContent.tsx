import React, { FunctionComponent } from "react";
import { AppText } from "../Layout/AppText";
import { sharedStyles } from "./sharedStyles";
import { View, Platform, Linking } from "react-native";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { Feather } from "@expo/vector-icons";
import { size, color } from "../../common/styles";

export const UpdateFromAppStoreContent: FunctionComponent = () => {
  const supportLink = `mailto:supplyallyhelp@hive.gov.sg?subject=[SupplyAlly App Store Update Error]`;
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
    <>
      <AppText style={sharedStyles.emoji}>📦</AppText>
      <AppText style={sharedStyles.heading}>
        SupplyAlly needs to be updated
      </AppText>
      <AppText style={sharedStyles.description}>
        Please update the app through the {storeName} to continue using
        SupplyAlly.
      </AppText>
      <AppText style={sharedStyles.additionalInfo}>
        If this persists, drop us an email at{" "}
        <AppText
          style={sharedStyles.emailLink}
          onPress={() => Linking.openURL(supportLink)}
        >
          supplyallyhelp@hive.gov.sg
        </AppText>
      </AppText>

      <View style={sharedStyles.ctaButton}>
        <DarkButton
          text={`Go to the ${storeName}`}
          onPress={() => Linking.openURL(storeLink)}
          icon={
            <Feather
              name="external-link"
              size={size(2)}
              color={color("grey", 0)}
            />
          }
        />
      </View>
    </>
  );
};
