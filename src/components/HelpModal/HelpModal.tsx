import React, {
  FunctionComponent,
  PropsWithChildren,
  useRef,
  useState,
} from "react";
import { WebView, WebViewProps } from "react-native-webview";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Linking,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { size, color, borderRadius, fontSize } from "../../common/styles";
import { AppText } from "../Layout/AppText";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

const FAQ_SUPPORT_URL = "https://www.supply.gov.sg/faqs/supportrelated/";
const SUPPORT_EMAIL_REF = "mailto:govsupply_support@tech.gov.sg";

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: size(1),
    paddingHorizontal: size(1),
    backgroundColor: color("grey", 0),
    alignItems: "center",
  },
  topBar: {
    borderBottomWidth: 1,
    borderBottomColor: color("grey", 30),
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: color("grey", 30),
  },
  pageTitle: {
    fontFamily: "brand-bold",
    fontSize: fontSize(2),
    marginLeft: size(2),
  },
  navigationButtons: {
    flexDirection: "row",
  },
  navigationButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius(2),
    padding: size(1),
  },
  disabledNavigationButton: {
    opacity: 0.5,
  },
});

const NavigationIcon: FunctionComponent<{
  name: keyof typeof Feather.glyphMap;
}> = ({ name }) => (
  <Feather name={name} size={size(3)} color={color("blue", 50)} />
);

const NavigationButton: FunctionComponent<
  PropsWithChildren<{
    onPress?: () => void;
    disabled?: boolean;
  }>
> = ({ onPress, disabled = false, children }) => (
  <TouchableOpacity onPress={onPress} disabled={disabled}>
    <View
      style={[
        styles.navigationButton,
        disabled ? styles.disabledNavigationButton : {},
      ]}
    >
      {children}
    </View>
  </TouchableOpacity>
);

export const HelpModal: FunctionComponent<{
  isVisible: boolean;
  onExit: () => void;
}> = ({ isVisible, onExit }) => {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const { i18nt } = useTranslate();

  const onPressAskQuestion = (): void => {
    if (webViewRef.current) {
      Linking.openURL(SUPPORT_EMAIL_REF);
    }
  };

  const onBack = (): void => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
    }
  };

  const onForward = (): void => {
    if (webViewRef.current) {
      webViewRef.current.goForward();
    }
  };

  const onNavigationStateChange: WebViewProps["onNavigationStateChange"] = (
    navState
  ) => {
    setCanGoBack(navState.canGoBack ?? false);
    setCanGoForward(navState.canGoForward ?? false);
  };

  /**
   * Modal catches the physical back button events and calls onRequestClose.
   * This checks if there's more pages to go back within the WebView,
   * before actually closing the modal.
   */
  const onRequestClose = (): void => {
    if (canGoBack) {
      onBack();
    } else {
      onExit();
    }
  };

  return (
    <Modal
      visible={isVisible}
      onRequestClose={onRequestClose}
      animationType="slide"
    >
      <SafeAreaView style={{ flex: 1, marginTop: size(4) }}>
        <View style={[styles.bar, styles.topBar]}>
          <AppText style={styles.pageTitle}>
            {i18nt("navigationDrawer", "helpSupport")}
          </AppText>
          <NavigationButton onPress={onExit}>
            <NavigationIcon name="x" />
          </NavigationButton>
        </View>
        <WebView
          ref={webViewRef}
          source={{ uri: FAQ_SUPPORT_URL }}
          onNavigationStateChange={onNavigationStateChange}
        />
        <View style={[styles.bar, styles.bottomBar]}>
          <View style={styles.navigationButtons}>
            <NavigationButton disabled={!canGoBack} onPress={onBack}>
              <NavigationIcon name="chevron-left" />
            </NavigationButton>
            <View style={{ marginLeft: size(0.5) }}>
              <NavigationButton disabled={!canGoForward} onPress={onForward}>
                <NavigationIcon name={"chevron-right"} />
              </NavigationButton>
            </View>
          </View>
          <DarkButton
            onPress={onPressAskQuestion}
            text={i18nt("loginScanCard", "askQuestion")}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};
