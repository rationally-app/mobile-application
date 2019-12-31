import React, { FunctionComponent } from "react";
import { ScrollView } from "react-native";
import { DocumentListItem } from "./DocumentListItem";
import { size } from "../../common/styles";

export interface DocumentItem {
  id: string;
  title: string;
  isVerified?: boolean;
  lastVerification?: number;
}

export interface DocumentList {
  documents: DocumentItem[];
  navigateToDoc: (documentId: string) => void;
}

export const DocumentList: FunctionComponent<DocumentList> = ({
  documents,
  navigateToDoc
}) => {
  const renderedDocumentListItem = documents.map(doc => (
    <DocumentListItem
      key={doc.id}
      title={doc.title}
      isVerified={doc.isVerified}
      lastVerification={doc.lastVerification}
      onPress={(): void => navigateToDoc(doc.id)}
    />
  ));
  return (
    <ScrollView
      testID="document-list"
      style={{
        width: "100%",
        paddingVertical: size(4),
        paddingHorizontal: size(3),
        height: "100%"
      }}
    >
      {renderedDocumentListItem}
    </ScrollView>
  );
};
