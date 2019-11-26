import React, { FunctionComponent } from "react";
import { DocumentObject, NavigationProps } from "../../types";
import { DocumentRenderer } from "./DocumentRenderer";
import { LoadingView } from "../Loading";
import { ScreenView } from "../ScreenView";
import { DocumentDetailsSheet } from "./DocumentDetailsSheet";
import { View } from "react-native";

export interface DocumentRendererScreenContainer extends NavigationProps {
  document?: DocumentObject;
}

export const DocumentRendererScreenContainer: FunctionComponent<DocumentRendererScreenContainer> = ({
  document,
  navigation
}) => {
  const output = document ? (
    <View style={{ flex: 1 }}>
      <DocumentRenderer
        document={document.document}
        goBack={navigation.goBack}
      />
      <DocumentDetailsSheet document={document.document} />
    </View>
  ) : (
    <LoadingView />
  );

  return <ScreenView>{output}</ScreenView>;
};
