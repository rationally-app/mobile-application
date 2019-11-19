import React, { FunctionComponent } from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TemplateTabs } from "./TemplateTabs";
import { VERY_LIGHT, DARK } from "../../common/colors";

export interface HeaderBackButton {
  onPress: () => void;
}

export const HeaderBackButton: FunctionComponent<HeaderBackButton> = ({
  onPress
}) => {
  return (
    <TouchableOpacity
      testID="header-back-button"
      onPress={onPress}
      style={{
        paddingLeft: 24,
        paddingRight: 24,
        justifyContent: "center"
      }}
    >
      <Ionicons name="md-arrow-round-back" size={20} color={DARK} />
    </TouchableOpacity>
  );
};

export interface DocumentRendererHeader extends TemplateTabs {
  goBack?: () => void;
}

export const DocumentRendererHeader: FunctionComponent<DocumentRendererHeader> = ({
  goBack,
  tabs,
  tabSelect,
  activeTabId
}) => {
  return (
    <View
      testID="document-renderer-header"
      style={{
        flexDirection: "row",
        height: 56,
        borderBottomWidth: 2,
        borderStyle: "solid",
        borderColor: VERY_LIGHT,
        marginBottom: 5
      }}
    >
      <HeaderBackButton
        onPress={() => {
          if (goBack) goBack();
        }}
      />
      <TemplateTabs
        tabs={tabs}
        tabSelect={tabSelect}
        activeTabId={activeTabId}
      />
    </View>
  );
};
