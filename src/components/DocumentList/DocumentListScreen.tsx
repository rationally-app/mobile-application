import React, { FunctionComponent } from "react";
import { NavigationProps } from "../../types";
import { DocumentList, DocumentItem } from "./DocumentList";
import { BottomNav } from "../Layout/BottomNav";
import { EmptyDocumentList } from "./EmptyDocumentList";
import { LoadingView } from "../Loading";
import { SafeAreaView } from "react-native";

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
    <>
      <SafeAreaView style={{ flex: 1 }}>
        {documentItems ? (
          <ResolvedDocumentList
            documentItems={documentItems}
            navigateToDoc={navigateToDoc}
            navigateToScanner={navigateToScanner}
          />
        ) : (
          <LoadingView /> // Prevents the flash of the empty state when documentItems hasn't initialized
        )}
      </SafeAreaView>
      <BottomNav navigation={navigation} />
    </>
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
