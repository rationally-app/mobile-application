// Given a OA document and url, render it with webview
import React, { useEffect, useRef, useState } from "react";
import { getData } from "@govtechsg/open-attestation";
import ReactNative, {
  View,
  Text,
  TouchableWithoutFeedback
} from "react-native";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { Document } from "@govtechsg/open-attestation";

interface IWebViewRef {
  current:
    | {
        injectJavaScript: Function | undefined;
      }
    | undefined;
}

interface ITab {
  id: string;
  label: string;
}

const wrapperStyle: ReactNative.ViewStyle = {
  flex: 1,
  paddingTop: 24,
  justifyContent: "center"
};

const TemplateTabs = ({
  tabs,
  tabSelect
}: {
  tabs: ITab[];
  tabSelect: Function;
}) => {
  // Do not show when there is only one tab
  if (!tabs || tabs.length <= 1) return null;
  const renderedTabs = tabs.map((tab, index) => (
    <TouchableWithoutFeedback onPress={() => tabSelect(index)} key={index}>
      <Text>{tab.label}</Text>
    </TouchableWithoutFeedback>
  ));
  return <View>{renderedTabs}</View>;
};

const DocumentRenderer = ({ document }: { document: Document }) => {
  const data = getData(document);
  const refWebView = useRef();
  const [inject, setInject] = useState();
  const [template, setTemplate] = useState<ITab[]>([]);

  useEffect(() => {
    const { current } = refWebView as IWebViewRef;
    if (current && current.injectJavaScript)
      setInject(() => current.injectJavaScript);
  }, [true]);

  const onTemplateMessageHandler = (event: WebViewMessageEvent) => {
    setTemplate(JSON.parse(event.nativeEvent.data));
  };

  const onTabSelect = (tabIndex: number) => {
    inject(`window.openAttestation.selectTemplateTab(${tabIndex})`);
  };

  return (
    <View style={wrapperStyle}>
      <TemplateTabs tabs={template} tabSelect={onTabSelect} />
      <WebView
        ref={refWebView}
        source={{ uri: data.$template.url }}
        injectedJavaScript={`
          // Render the document
          const documentToRender = ${JSON.stringify(data)};
          window.openAttestation.renderDocument(documentToRender);

          // Constantly poll if template tabs is known
          const epoch = 100;
          let timeout = 10000;
          const replyWithTemplateTabs = () => {
            const templates = window.openAttestation.getTemplates();
            timeout = timeout - epoch;
            if(templates){
              window.ReactNativeWebView.postMessage(JSON.stringify(templates));
            }else if(timeout > 0){
              setTimeout(replyWithTemplateTabs, epoch);
            }
          }
          replyWithTemplateTabs();
        `}
        onMessage={onTemplateMessageHandler}
      />
    </View>
  );
};

export default DocumentRenderer;
