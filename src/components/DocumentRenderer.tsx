// Given a OA document and url, render it with webview
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { getData, Document } from "@govtechsg/open-attestation";
import ReactNative, {
  View,
  Text,
  TouchableWithoutFeedback
} from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";

import { get } from "lodash";

interface WebViewRef {
  current:
    | {
        injectJavaScript: Function | undefined;
      }
    | undefined;
}

interface Tab {
  id: string;
  label: string;
}

const wrapperStyle: ReactNative.ViewStyle = {
  flex: 1,
  paddingTop: 24,
  justifyContent: "center"
};

interface TemplateTabsProps {
  tabs: Tab[];
  tabSelect: Function;
}

const TemplateTabs: FunctionComponent<TemplateTabsProps> = ({
  tabs,
  tabSelect
}: TemplateTabsProps) => {
  // Do not show when there is only one tab
  if (!tabs || tabs.length <= 1) return null;
  const renderedTabs = tabs.map(tab => (
    <TouchableWithoutFeedback
      onPress={(): void => tabSelect(tab.id)}
      key={tab.id}
    >
      <Text>{tab.label}</Text>
    </TouchableWithoutFeedback>
  ));
  return <View>{renderedTabs}</View>;
};

interface DocumentRendererProps {
  document: Document;
}

const DocumentRenderer: FunctionComponent<DocumentRendererProps> = ({
  document
}: DocumentRendererProps) => {
  const data = getData(document);
  const refWebView = useRef();
  const [inject, setInject] = useState();
  const [template, setTemplate] = useState<Tab[]>([]);

  useEffect(() => {
    const { current } = refWebView as WebViewRef;
    if (current && current.injectJavaScript)
      setInject(() => current.injectJavaScript);
  }, [true]);

  const onTemplateMessageHandler = (event: WebViewMessageEvent): void => {
    setTemplate(JSON.parse(event.nativeEvent.data));
  };

  const onTabSelect = (tabIndex: string): void => {
    inject(
      `window.openAttestation({type: "SELECT_TEMPLATE", payload: "${tabIndex}"})`
    );
  };

  return (
    <View style={wrapperStyle}>
      <TemplateTabs tabs={template} tabSelect={onTabSelect} />
      <WebView
        ref={refWebView}
        source={{
          uri: get(data, "$template.url")
        }}
        injectedJavaScript={`
          // Render the document
          const documentToRender = ${JSON.stringify(data)};
          const rawDocument = ${JSON.stringify(document)}
          window.openAttestation({type: "RENDER_DOCUMENT", payload: {document: documentToRender, rawDocument}});

          // Retrieve the templates
          const templates = window.openAttestation({type: "GET_TEMPLATES", payload: documentToRender});
          window.ReactNativeWebView.postMessage(JSON.stringify(templates));
        `}
        onMessage={onTemplateMessageHandler}
      />
    </View>
  );
};

export default DocumentRenderer;
