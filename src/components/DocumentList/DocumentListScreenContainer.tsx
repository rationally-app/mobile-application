import React, { FunctionComponent } from "react";
import { DocumentObject, NavigationProps } from "../../types";
import { getData } from "@govtechsg/open-attestation";
import { ScreenView } from "../ScreenView";
import { DocumentList } from "./DocumentList";

export interface DocumentListScreenContainer extends NavigationProps {
  documents: DocumentObject[];
}

export const DocumentListScreenContainer: FunctionComponent<DocumentListScreenContainer> = ({
  documents,
  navigation
}) => {
  const navigateToDoc = (id: string): boolean =>
    navigation.navigate("IndividualDocumentScreen", { id });
  const documentItems = documents.map((doc: DocumentObject) => {
    const docClear = getData(doc.document);
    return {
      id: doc.id,
      title: docClear.name,
      isVerified: doc.isVerified,
      lastVerification: doc.verified
    };
  });
  return (
    <ScreenView>
      <DocumentList documents={documentItems} navigateToDoc={navigateToDoc} />
    </ScreenView>
  );
};
