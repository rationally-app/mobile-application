import React, { FunctionComponent } from "react";
import { Header } from "../Layout/Header";
import { TemplateTabs } from "./TemplateTabs";
import { color } from "../../common/styles";
import { Platform } from "react-native";

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
    <Header
      goBack={goBack}
      style={{
        backgroundColor: color("grey", 5),
        borderBottomWidth: 1,
        borderStyle: "solid",
        borderColor: color("grey", 15)
      }}
      // Having a shadow on Android causes the background overlay
      // of the bottom sheet to be hidden behind this header.
      // Using elevation/zIndex doesn't properly push the bottom sheet
      // and its background overlay above this header.
      hasShadow={Platform.OS !== "android"}
    >
      <TemplateTabs
        tabs={tabs}
        tabSelect={tabSelect}
        activeTabId={activeTabId}
      />
    </Header>
  );
};
