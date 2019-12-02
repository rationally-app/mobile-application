import React, { FunctionComponent } from "react";
import { NavigationProps } from "../../types";
import { ScreenView } from "../ScreenView";
import { DocumentList, DocumentItem } from "./DocumentList";
import { BottomNav } from "../Layout/BottomNav";
import { EmptyDocumentList } from "./EmptyDocumentList";

interface DocumentListLayout extends NavigationProps {
  documentItems: DocumentItem[];
  navigateToDoc: (documentId: string) => boolean;
  navigateToScanner: () => void;
}

export const DocumentListLayout: FunctionComponent<DocumentListLayout> = ({
  navigation,
  navigateToDoc,
  documentItems,
  navigateToScanner
}) => {
  return (
    <ScreenView>
      {documentItems.length > 0 ? (
        <DocumentList documents={documentItems} navigateToDoc={navigateToDoc} />
      ) : (
        <EmptyDocumentList onAdd={navigateToScanner} />
      )}
      <BottomNav navigation={navigation} />
    </ScreenView>
  );
};
