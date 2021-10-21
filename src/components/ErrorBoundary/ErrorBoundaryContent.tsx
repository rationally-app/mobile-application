import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";
import React, { FunctionComponent } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { size, fontSize } from "../../common/styles";
import { AppText } from "../Layout/AppText";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import AlertIcon from "../../../assets/icons/alert.svg";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import {
  deleteStoreInBuckets,
  readFromStoreInBuckets,
} from "../../utils/bucketStorageHelper";
import { AUTH_CREDENTIALS_STORE_KEY } from "../../context/authStore";
import { formatDateTime } from "../../utils/dateTimeFormatter";

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: size(4),
    paddingTop: "20%",
  },
  content: {
    width: 512,
    maxWidth: "100%",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginBottom: size(3),
  },
  heading: {
    fontFamily: "brand-bold",
    fontSize: fontSize(3),
    textAlign: "center",
  },
  body: {
    marginTop: size(1.5),
    textAlign: "center",
  },
  errorDescription: {
    textAlign: "center",
    marginTop: size(4),
    fontSize: fontSize(-3),
  },
  restartButton: {
    position: "absolute",
    bottom: size(12),
    marginHorizontal: size(4),
    marginTop: size(5),
    maxWidth: 512,
    width: "100%",
  },
  logoutButton: {
    flexDirection: "row",
    alignSelf: "center",
    paddingHorizontal: size(4),
    paddingVertical: size(3),
    marginHorizontal: size(4),
    marginBottom: size(3),
    maxWidth: 512,
    width: "100%",
  },
  logoutText: {
    fontSize: fontSize(0),
    fontFamily: "brand-bold",
  },
});

export const ErrorBoundaryContent: FunctionComponent<{
  errorName?: string;
}> = ({ errorName }) => {
  const { i18nt } = useTranslate();

  const handleLogout = async (storageKey: string): Promise<void> => {
    // get latest secureStore value from bucket
    const oldValue = await readFromStoreInBuckets(storageKey);

    // clear device storage
    await deleteStoreInBuckets(storageKey, oldValue);
    await AsyncStorage.clear();

    Updates.reloadAsync();
  };

  const errorDescription = errorName
    ? `(${errorName} ${formatDateTime(Date.now())})`
    : undefined;

  let header, body, restartButtonText, logoutButtonText;

  switch (errorName) {
    case "NetworkError": {
      header = i18nt("errorMessages", "networkError", "title");
      body = i18nt("errorMessages", "networkError", "body");
      restartButtonText = i18nt(
        "errorMessages",
        "networkError",
        "primaryActionText"
      );
      logoutButtonText = i18nt(
        "errorMessages",
        "networkError",
        "secondaryActionText"
      );
      break;
    }
    default: {
      header = i18nt("errorMessages", "systemError", "title");
      body = i18nt("errorMessages", "systemError", "body");
      restartButtonText = i18nt(
        "errorMessages",
        "systemError",
        "primaryActionText"
      );
      logoutButtonText = i18nt(
        "errorMessages",
        "systemError",
        "secondaryActionText"
      );
    }
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        <AlertIcon style={styles.icon} width={size(5)} height={size(5)} />
        <AppText style={styles.heading}>{header}</AppText>
        <AppText style={styles.body}>{body}</AppText>
        {errorDescription && (
          <AppText style={styles.errorDescription}>{errorDescription}</AppText>
        )}
      </View>
      <View style={styles.restartButton}>
        <DarkButton
          text={restartButtonText}
          onPress={() => Updates.reloadAsync()}
          fullWidth={true}
        />
      </View>
      <View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => handleLogout(AUTH_CREDENTIALS_STORE_KEY)}
        >
          <AppText style={styles.logoutText}>{logoutButtonText}</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};
