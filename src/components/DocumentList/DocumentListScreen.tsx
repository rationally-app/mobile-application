import React, { FunctionComponent } from "react";
import { NavigationProps } from "../../types";
import { ScreenView } from "../ScreenView";
import { DocumentList, DocumentItem } from "./DocumentList";
import { BottomNav } from "../Layout/BottomNav";
import { EmptyDocumentList } from "./EmptyDocumentList";
import { LoadingView } from "../Loading";

interface DocumentListScreen extends NavigationProps {
  documentItems?: DocumentItem[];
  navigateToDoc: (documentId: string) => boolean;
  navigateToScanner: () => void;
}

export const DocumentListScreen: FunctionComponent<DocumentListScreen> = ({
  navigation,
  navigateToDoc,
  documentItems,
  navigateToScanner
}) => {
  return (
    <ScreenView>
      {documentItems ? (
        <ResolvedDocumentList
          documentItems={documentItems}
          navigateToDoc={navigateToDoc}
          navigateToScanner={navigateToScanner}
        />
      ) : (
        <LoadingView /> // Prevents the flash of the empty state when documentItems hasn't initialized
      )}
      <BottomNav navigation={navigation} />
    </ScreenView>
  );
};

interface ResolvedDocumentList {
  documentItems: DocumentItem[];
  navigateToDoc: (documentId: string) => boolean;
  navigateToScanner: () => void;
}

const ResolvedDocumentList: FunctionComponent<ResolvedDocumentList> = ({
  documentItems,
  navigateToDoc,
  navigateToScanner
}) => {
  return documentItems.length > 0 ? (
    <DocumentList documents={documentItems} navigateToDoc={navigateToDoc} />
  ) : (
    <EmptyDocumentList onAdd={navigateToScanner} />
  );
};
