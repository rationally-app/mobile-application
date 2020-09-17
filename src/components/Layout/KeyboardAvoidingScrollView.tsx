import React, { FunctionComponent } from "react";
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ScrollViewProps,
  KeyboardAvoidingViewProps, View, FlatList
} from "react-native";

interface KeyboardAvoidingScrollView {
  keyboardAvoidingViewStyle?: KeyboardAvoidingViewProps["style"];
  scrollViewContentContainerStyle?: ScrollViewProps["contentContainerStyle"];
  scrollable?: boolean;
}

export const KeyboardAvoidingScrollView: FunctionComponent<KeyboardAvoidingScrollView> = ({
  keyboardAvoidingViewStyle = {},
  scrollViewContentContainerStyle = { alignItems: "center" },
  scrollable = true,
  children
}) => (
  <KeyboardAvoidingView
    behavior={Platform.select({ ios: "padding" })}
    style={keyboardAvoidingViewStyle}
  >
    {console.log(scrollable)}
    {scrollable ? (
      <ScrollView
        contentContainerStyle={scrollViewContentContainerStyle}
        scrollIndicatorInsets={{ right: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    ) : (
      <View style={scrollViewContentContainerStyle}>{children}</View>
      // <FlatList
      //   nestedScrollEnabled={true}
      //   data={[]}
      //   ListEmptyComponent={null}
      //   keyExtractor={() => "dummy"}
      //   renderItem={null}
      //   ListHeaderComponent={() => <React.Fragment>{children}</React.Fragment>}
      // />
    )}
  </KeyboardAvoidingView>
);
