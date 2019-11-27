import React, { FunctionComponent } from "react";
import { NavigationProps } from "../../types";
import { DocumentRenderer } from "./DocumentRenderer";
import { ScreenView } from "../ScreenView";
import { Document } from "@govtechsg/open-attestation";

export const ScannedDocumentRendererContainer: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  const document: Document = navigation.getParam("document");

  return (
    <ScreenView>
      <DocumentRenderer document={document} goBack={navigation.goBack} />
    </ScreenView>
  );
};
