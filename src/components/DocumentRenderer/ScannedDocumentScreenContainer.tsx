import React, { FunctionComponent } from "react";
import { NavigationProps } from "../../types";
import { DocumentRenderer } from "./DocumentRenderer";
import { ScreenView } from "../ScreenView";
import { Document } from "@govtechsg/open-attestation";

export interface ScannedDocumentScreenContainer extends NavigationProps {
  document: Document;
  storeDocument: boolean;
}

export const ScannedDocumentScreenContainer: FunctionComponent<ScannedDocumentScreenContainer> = ({
  document,
  navigation
}) => {
  return (
    <ScreenView>
      <DocumentRenderer document={document} goBack={navigation.goBack} />
    </ScreenView>
  );
};
