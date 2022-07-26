import React, { FunctionComponent } from "react";
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ScrollViewProps,
  KeyboardAvoidingViewProps,
} from "react-native";

interface KeyboardAvoidingScrollView {
  keyboardAvoidingViewStyle?: KeyboardAvoidingViewProps["style"];
  scrollViewContentContainerStyle?: ScrollViewProps["contentContainerStyle"];
}

export const KeyboardAvoidingScrollView: FunctionComponent<KeyboardAvoidingScrollView> = ({
  keyboardAvoidingViewStyle = {},
  scrollViewContentContainerStyle = { alignItems: "center" },
  children,
}) => (
  <KeyboardAvoidingView
    behavior={Platform.select({ ios: "padding" })}
    style={keyboardAvoidingViewStyle}
  >
    <ScrollView
      contentContainerStyle={scrollViewContentContainerStyle}
      scrollIndicatorInsets={{ right: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  </KeyboardAvoidingView>
);
