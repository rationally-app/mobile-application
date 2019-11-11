// Given a OA document and url, render it with webview
import React, { FunctionComponent, useState } from "react";
import { Document } from "@govtechsg/open-attestation";
import ReactNative, { View } from "react-native";
import { WebViewMessageEvent } from "react-native-webview";
import TemplateTabs, { Tab } from "./TemplateTabs";
import WebViewFrame from "./WebViewFrame";

const wrapperStyle: ReactNative.ViewStyle = {
  flex: 1,
  paddingTop: 24,
  justifyContent: "center"
};

interface DocumentRendererProps {
  document: Document;
}

const DocumentRenderer: FunctionComponent<DocumentRendererProps> = ({
  document
}: DocumentRendererProps) => {
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

export default DocumentRenderer;
