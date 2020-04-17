import React, { FunctionComponent, useRef, useState } from "react";
import { WebView } from "react-native-webview";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  WebViewProps
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { size, color, borderRadius, fontSize } from "../../common/styles";
import { AppText } from "../Layout/AppText";
import { SafeAreaView } from "react-navigation";

const BASE_URL = "https://supplyallyhelp.zendesk.com/hc/en-sg";
const FEEDBACK_URL = BASE_URL + "/requests/new";

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: size(1),
    paddingHorizontal: size(1),
    backgroundColor: color("grey", 0),
    alignItems: "center"
  },
  topBar: {
    borderBottomWidth: 1,
    borderBottomColor: color("grey", 30)
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: color("grey", 30)
  },
  pageTitle: {
    fontFamily: "brand-bold",
    fontSize: fontSize(2),
    marginLeft: size(2)
  },
  navigationButtons: {
    flexDirection: "row"
  },
  navigationButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: borderRadius(2),
    padding: size(1)
  },
  disabledNavigationButton: {
    opacity: 0.5
  }
});

const NavigationIcon: FunctionComponent<{ name: string }> = ({ name }) => (
  <Feather name={name} size={size(3)} color={color("blue", 50)} />
);

const NavigationButton: FunctionComponent<{
  onPress?: () => void;
  disabled?: boolean;
}> = ({ onPress, disabled = false, children }) => (
  <TouchableOpacity onPress={onPress} disabled={disabled}>
    <View
      style={[
        styles.navigationButton,
        disabled ? styles.disabledNavigationButton : {}
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

  const onPressAskQuestion = (): void => {
    if (webViewRef.current) {
      const redirectTo = `window.location = "${FEEDBACK_URL}"`;
      webViewRef.current.injectJavaScript(redirectTo);
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

  const onNavigationStateChange: WebViewProps["onNavigationStateChange"] = navState => {
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
      <SafeAreaView style={{ flex: 1 }}>
        <View style={[styles.bar, styles.topBar]}>
          <AppText style={styles.pageTitle}>Help &amp; Support</AppText>
          <NavigationButton onPress={onExit}>
            <NavigationIcon name="x" />
          </NavigationButton>
        </View>
        <WebView
          ref={webViewRef}
          source={{ uri: BASE_URL }}
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
          <DarkButton onPress={onPressAskQuestion} text="Ask a question" />
        </View>
      </SafeAreaView>
    </Modal>
  );
};
