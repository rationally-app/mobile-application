import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
  useContext
} from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { NavigationProps, Appeal } from "../../types";
import { color, size } from "../../common/styles";
import { useAuthenticationContext } from "../../context/auth";
import { AppHeader } from "../Layout/AppHeader";
import { AppText } from "../Layout/AppText";
import { TopBackground } from "../Layout/TopBackground";
import { useConfigContext } from "../../context/config";
import { Card } from "../Layout/Card";
import { useCart } from "../../hooks/useCart/useCart";
import * as Sentry from "sentry-expo";
import { HelpModalContext } from "../../context/help";
import { useProductContext } from "../../context/products";
import { HelpButton } from "../Layout/Buttons/HelpButton";
import { FeatureToggler } from "../FeatureToggler/FeatureToggler";
import { useValidateExpiry } from "../../hooks/useValidateExpiry";
import { Banner } from "../Layout/Banner";
import { ImportantMessageContentContext } from "../../context/importantMessage";
import { KeyboardAvoidingScrollView } from "../Layout/KeyboardAvoidingScrollView";
import { ReasonSelectionCard } from "./ResonSelectionCard";

const styles = StyleSheet.create({
  loadingWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  content: {
    position: "relative",
    padding: size(1.5),
    paddingTop: size(8),
    paddingBottom: size(10),
    height: "100%",
    width: 512,
    maxWidth: "100%"
  },
  headerText: {
    marginBottom: size(4)
  },
  bannerWrapper: {
    marginBottom: size(1.5)
  }
});

const showAlert = (message: string, onDismiss: () => void): void =>
  Alert.alert("Error", message, [{ text: "OK", onPress: onDismiss }], {
    onDismiss: onDismiss // for android outside alert clicks
  });

const getReasons = (appeal: Appeal[]): string[] => {
  return appeal.map(appealEntry => appealEntry.reason);
};

export const AppealReasonScreen: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  const [ids, setIds] = useState([navigation.getParam("ids")]);

  const { getAppeal } = useProductContext();

  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: "AppealReasonScreen"
    });
  }, []);

  const validateTokenExpiry = useValidateExpiry(navigation.dispatch);
  useEffect(() => {
    validateTokenExpiry();
  }, [validateTokenExpiry]);

  const onCancel = useCallback((): void => {
    navigation.goBack();
  }, [navigation]);

  const messageContent = useContext(ImportantMessageContentContext);
  const { config } = useConfigContext();
  const showHelpModal = useContext(HelpModalContext);

  return (
    <KeyboardAvoidingScrollView>
      <TopBackground mode={config.appMode} />

      <View style={styles.content}>
        <View style={styles.headerText}>
          <AppHeader mode={config.appMode} />
        </View>

        {messageContent && (
          <View style={styles.bannerWrapper}>
            <Banner {...messageContent} />
          </View>
        )}
        <ReasonSelectionCard
          ids={ids}
          reasonSelectionHeader={"Indicate reason for dispute"}
          reasons={getReasons(getAppeal() ?? [])}
          onCancel={onCancel}
        />
        <FeatureToggler feature="HELP_MODAL">
          <HelpButton onPress={showHelpModal} />
        </FeatureToggler>
      </View>
    </KeyboardAvoidingScrollView>
  );
};
