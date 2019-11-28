import React, { FunctionComponent, useState, useEffect } from "react";
import { Text } from "react-native";
import { Tab, WebViewFrame as WebViewFrameInterface } from "../WebViewFrame";

export const mockTabs: Tab[] = [
  {
    id: "tab-1",
    label: "Tab 1"
  },
  {
    id: "tab-2",
    label: "Tab 2"
  }
];

export const contentOfTab = (id: string): string => {
  return JSON.stringify(mockTabs.find(tab => tab.id === id));
};

export const WebViewFrame: FunctionComponent<WebViewFrameInterface> = ({
  setGoToTab,
  setTabs,
  setActiveTabId
}) => {
  const [activeTab, setActiveTab] = useState<string>(mockTabs[0].id);
  useEffect(() => {
    setGoToTab(() => (id: string) => setActiveTab(id));
    setTabs(mockTabs);
    setActiveTabId(mockTabs[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Text testID="mock-web-view-frame">{contentOfTab(activeTab)}</Text>;
};
