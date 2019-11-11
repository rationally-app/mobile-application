// Given a OA document and url, render it with webview
import React, { FunctionComponent, useRef, useEffect } from "react";
import { getData, Document } from "@govtechsg/open-attestation";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { get } from "lodash";

export interface WebViewFrameRef {
  current?: {
    injectJavaScript?: Function;
  };
}

export interface WebViewFrameProps {
  document: Document;
  onTemplateMessageHandler: (event: WebViewMessageEvent) => void;
  setGoToTemplate: Function;
}

const WebViewFrame: FunctionComponent<WebViewFrameProps> = ({
  document,
  onTemplateMessageHandler,
  setGoToTemplate
}: WebViewFrameProps) => {
  const webViewRef = useRef();
  const data = getData(document);

  useEffect(() => {
    const { current } = webViewRef as WebViewFrameRef;
    if (current && current.injectJavaScript)
      setGoToTemplate(
        (): Function => (tabId: string): void =>
          current.injectJavaScript(
            `window.openAttestation({type: "SELECT_TEMPLATE", payload: "${tabId}"})`
          )
      );
  }, [true]);

  return (
    <WebView
      ref={webViewRef}
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
  );
};

export default WebViewFrame;
