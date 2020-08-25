import React, { useEffect, FunctionComponent } from "react";
import * as Sentry from "sentry-expo";
import { AppText } from "../components/Layout/AppText";
import { StyleSheet, View, Linking, Platform } from "react-native";
import { size, fontSize } from "../common/styles";
import { DarkButton } from "../components/Layout/Buttons/DarkButton";

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: size(5)
  },
  content: {
    width: 512,
    maxWidth: "100%",
    marginTop: -size(4),
    alignItems: "center"
  },
  heading: {
    fontFamily: "brand-bold",
    fontSize: fontSize(3),
    textAlign: "center"
  },
  feedback: {
    marginTop: size(1),
    textAlign: "center"
  },
  updateButton: {
    marginTop: size(4)
  }
});

const OutdatedAppScreen: FunctionComponent = () => {
  useEffect(() => {
    Sentry.captureException(new Error("Using default release channel"));
  }, []);

  let storeName: string;
  let storeLink: string;
  switch (Platform.OS) {
    case "ios":
      storeName = "App Store";
      storeLink = "https://apps.apple.com/sg/app/supplyally/id1497126533";
      break;

    case "android":
    default:
      storeName = "Play Store";
      storeLink =
        "https://play.google.com/store/apps/details?id=sg.gov.tech.musket";
      break;
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        <AppText style={styles.heading}>Outdated app</AppText>
        <AppText style={styles.feedback}>
          Update your app through the {storeName}.
        </AppText>
        <View style={styles.updateButton}>
          <DarkButton
            text="Update app"
            onPress={() => Linking.openURL(storeLink)}
          />
        </View>
      </View>
    </View>
  );
};

export default OutdatedAppScreen;
