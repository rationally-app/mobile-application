import React, { FunctionComponent } from "react";
import { NavigationProps } from "../../types";
import { ScannedDocumentScreenContainer } from "../../components/DocumentRenderer/ScannedDocumentScreenContainer";
import { Document } from "@govtechsg/open-attestation";

const ScannedDocumentScreen: FunctionComponent<NavigationProps> = ({
  navigation
}: NavigationProps) => {
  const document: Document = navigation.getParam("document");
  const storeDocument: boolean = navigation.getParam("storeDocument") || false;

  return (
    <ScannedDocumentScreenContainer
      document={document}
      storeDocument={storeDocument}
      navigation={navigation}
    />
  );
};

export default ScannedDocumentScreen;
