// Given a OA document and url, render it with webview
import React, { FunctionComponent, useRef, useEffect, RefObject } from "react";
import { getData, Document } from "@govtechsg/open-attestation";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { get } from "lodash";

export interface WebViewFrameRef {
  current?: {
    injectJavaScript?: Function;
  };
}

export interface WebViewFrame {
  document: Document;
  onTemplateMessageHandler: (event: WebViewMessageEvent) => void;
  setGoToTemplate: Function;
}

export const WebViewFrame: FunctionComponent<WebViewFrame> = ({
  document,
  onTemplateMessageHandler,
  setGoToTemplate
}) => {
  const webViewRef: RefObject<WebView> = useRef<WebView>(null);
  const data = getData(document);

  useEffect(() => {
    const { current } = webViewRef;
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
