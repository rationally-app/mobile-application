import React, { FunctionComponent, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import { InitialisationContainerNavigationProps } from "../../types";
import { size } from "../../common/styles";
import { Credits } from "../Credits";
import { Sentry } from "../../utils/errorTracking";
import * as Linking from "expo-linking";
import { DarkButton } from "../Layout/Buttons";
import { AppText } from "../Layout/AppText";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

const styles = StyleSheet.create({
  asset: {
    width: 203,
    height: 206,
    center: true,
    marginBottom: size(8),
  },
  body: {
    textAlign: "center",
    font: "IBM Plex Sans",
    fontSize: 16,
    color: "#292B2C",
    fontWeight: "400",
    lineHeight: 24,
    width: 279,
    paddingBottom: size(2),
  },
  centerContent: {
    alignItems: "center",
  },
  credits: {
    bottom: size(3),
  },
  container: {
    justifyContent: "center",
    backgroundColor: "white",
    width: "100%",
    height: "100%",
  },
  heading: {
    textAlign: "center",
    font: "IBM Plex Sans",
    fontSize: 20,
    color: "#292B2C",
    fontWeight: "700",
    lineHeight: 28,
    width: 279,
    paddingBottom: size(1),
  },
  launchWebAppButton: {
    position: "absolute",
    bottom: size(10),
    width: 350,
    alignSelf: "center",
    marginBottom: size(2),
  },
});

export const InitialisationContainer: FunctionComponent<
  InitialisationContainerNavigationProps
> = ({}) => {
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: "BlockUser",
    });
  }, []);

  const { i18nt } = useTranslate();

  const handleWebNavigation = (): void => {
    Linking.openURL("https://app.supply.gov.sg");
  };

  return (
    <>
      <View style={styles.container} testID="block-user-view">
        <View style={styles.centerContent}>
          <Image
            source={require("../../../assets/blockuser.png")}
            style={styles.asset}
          />
          <AppText style={styles.heading}>
            {i18nt("blockUser", "header")}
          </AppText>
          <AppText style={styles.body}>{i18nt("blockUser", "body")}</AppText>
        </View>
        <View style={styles.launchWebAppButton}>
          <DarkButton
            fullWidth={true}
            text="Launch Webapp"
            onPress={handleWebNavigation}
            accessibilityLabel="launch-webapp"
          />
        </View>
        <Credits style={styles.credits} />
      </View>
    </>
  );
};
