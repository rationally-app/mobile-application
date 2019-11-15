// Given a OA document and url, render it with webview
import React, { FunctionComponent, useState } from "react";
import { Document } from "@govtechsg/open-attestation";
import ReactNative, { View } from "react-native";
import { WebViewMessageEvent } from "react-native-webview";
import { Tab, TemplateTabs } from "./TemplateTabs";
import { WebViewFrame } from "./WebViewFrame";

const wrapperStyle: ReactNative.ViewStyle = {
  flex: 1,
  paddingTop: 24,
  justifyContent: "center"
};

interface DocumentRenderer {
  document: Document;
}

export const DocumentRenderer: FunctionComponent<DocumentRenderer> = ({
  document
}) => {
  const [template, setTemplate] = useState<Tab[]>([]);
  const [goToTemplate, setGoToTemplate] = useState();

  const onTemplateMessageHandler = (event: WebViewMessageEvent): void => {
    setTemplate(JSON.parse(event.nativeEvent.data));
  };

  return (
    <View style={wrapperStyle}>
      <TemplateTabs tabs={template} tabSelect={goToTemplate} />
      <WebViewFrame
        setGoToTemplate={setGoToTemplate}
        document={document}
        onTemplateMessageHandler={onTemplateMessageHandler}
      />
    </View>
  );
};
