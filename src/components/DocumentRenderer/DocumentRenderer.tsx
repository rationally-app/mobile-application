// Given a OA document and url, render it with webview
import React, { FunctionComponent, useState } from "react";
import { Document } from "@govtechsg/open-attestation";
import ReactNative, { View } from "react-native";
import { Tab } from "./TemplateTabs";
import { WebViewFrame } from "./WebViewFrame";
import { DocumentRendererHeader } from "./DocumentRendererHeader";

const wrapperStyle: ReactNative.ViewStyle = {
  flex: 1,
  justifyContent: "center"
};

interface DocumentRenderer {
  document: Document;
  goBack?: () => void;
}

export const DocumentRenderer: FunctionComponent<DocumentRenderer> = ({
  document,
  goBack
}) => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [goToTab, setGoToTab] = useState<(tabId: string) => void>(() => {});
  const [activeTabId, setActiveTabId] = useState<string>("");

  const tabSelect = (id: string): void => {
    setActiveTabId(id);
    goToTab(id);
  };

  return (
    <View style={wrapperStyle}>
      <DocumentRendererHeader
        goBack={goBack}
        tabs={tabs}
        tabSelect={tabSelect}
        activeTabId={activeTabId}
      />
      <WebViewFrame
        document={document}
        setGoToTab={setGoToTab}
        setActiveTabId={setActiveTabId}
        setTabs={setTabs}
      />
    </View>
  );
};
