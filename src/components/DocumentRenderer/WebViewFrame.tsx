// Given a OA document and url, render it with webview
import React, { FunctionComponent, useRef, useEffect, RefObject } from "react";
import { getData, Document } from "@govtechsg/open-attestation";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { get } from "lodash";

export interface Tab {
  id: string;
  label: string;
}

export interface WebViewFrameRef {
  current?: {
    injectJavaScript?: Function;
  };
}

export interface WebViewFrame {
  document: Document;
  setGoToTab: (goToTab: (tabId: string) => void) => void;
  setTabs: (tabs: Tab[]) => void;
  setActiveTabId: (tabId: string) => void;
}

export const WebViewFrame: FunctionComponent<WebViewFrame> = ({
  document,
  setGoToTab,
  setTabs,
  setActiveTabId
}) => {
  const webViewRef: RefObject<WebView> = useRef<WebView>(null);
  const data = getData(document);

  useEffect(() => {
    const { current } = webViewRef;
    if (current && current.injectJavaScript)
      setGoToTab(() => (tabId: string): void =>
        current.injectJavaScript(
          `window.openAttestation({type: "SELECT_TEMPLATE", payload: "${tabId}"})`
        )
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTemplateMessageHandler = (event: WebViewMessageEvent): void => {
    const tabs = JSON.parse(event.nativeEvent.data) as Tab[];
    setTabs(tabs);
    setActiveTabId(tabs[0].id);
  };

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

          // Add spacing container to ensure the document isn't blocked by the bottom sheet
          const spacingContainer = document.createElement("div");
          spacingContainer.style.position = "absolute";
          spacingContainer.style.top = 0;
          spacingContainer.style.left = 0;
          spacingContainer.style.right = 0;
          spacingContainer.style.zIndex = -99;
          spacingContainer.style.height = "140vh";
          spacingContainer.style.pointerEvents = "none";
          document.body.appendChild(spacingContainer);
        `}
      onMessage={onTemplateMessageHandler}
    />
  );
};
