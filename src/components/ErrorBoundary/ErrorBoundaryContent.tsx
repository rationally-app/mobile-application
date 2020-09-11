import React, { FunctionComponent } from "react";
import { View, StyleSheet } from "react-native";
import { size, fontSize } from "../../common/styles";
import { AppText } from "../Layout/AppText";
import * as Updates from "expo-updates";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import AlertIcon from "../../../assets/icons/alert.svg";

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: size(4),
    paddingTop: "20%"
  },
  content: {
    width: 512,
    maxWidth: "100%",
    alignItems: "center",
    flex: 1
  },
  icon: {
    marginBottom: size(3)
  },
  heading: {
    fontFamily: "brand-bold",
    fontSize: fontSize(3),
    textAlign: "center"
  },
  body: {
    marginTop: size(1.5),
    textAlign: "center"
  },
  errorDescription: {
    textAlign: "center",
    marginTop: size(4),
    fontSize: fontSize(-3)
  },
  tokenDescription: {
    textAlign: "center",
    // marginTop: size(4),
    fontSize: fontSize(-3)
  },
  restartButton: {
    position: "absolute",
    bottom: size(4),
    marginHorizontal: size(4),
    marginTop: size(5),
    maxWidth: 512,
    width: "100%"
  }
});

export const ErrorBoundaryContent: FunctionComponent<{
  error?: string;
  operatorToken?: string;
}> = ({ error, operatorToken }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        <AlertIcon style={styles.icon} width={size(5)} height={size(5)} />
        <AppText style={styles.heading}>System issue</AppText>
        <AppText style={styles.body}>
          We are currently facing connectivity issues. Try restarting the app or
          contact GovTech if the problem persists.
        </AppText>
        {error && <AppText style={styles.errorDescription}>{error}</AppText>}
        {operatorToken && (
          <AppText style={styles.tokenDescription}>
            Code:{operatorToken}
          </AppText>
        )}
      </View>
      <View style={styles.restartButton}>
        <DarkButton
          text="Restart app"
          onPress={() => Updates.reloadAsync()}
          fullWidth={true}
        />
      </View>
    </View>
  );
};
