import React, { FunctionComponent } from "react";
import { DocumentObject, NavigationProps } from "../../types";
import { DocumentRenderer } from "./DocumentRenderer";
import { LoadingView } from "../Loading";
import { ScreenView } from "../ScreenView";

export interface DocumentRendererScreenContainer extends NavigationProps {
  document?: DocumentObject;
}

export const DocumentRendererScreenContainer: FunctionComponent<DocumentRendererScreenContainer> = ({
  document,
  navigation
}) => {
  const output = document ? (
    <DocumentRenderer document={document.document} goBack={navigation.goBack} />
  ) : (
    <LoadingView />
  );

  return <ScreenView>{output}</ScreenView>;
};
