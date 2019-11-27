import React, { FunctionComponent, useState, useEffect } from "react";
import { DocumentObject, NavigationProps } from "../../types";
import { getData } from "@govtechsg/open-attestation";
import { ScreenView } from "../ScreenView";
import { useDbContext } from "../../context/db";
import { DocumentList } from "./DocumentList";
import { BottomNav } from "../Layout/BottomNav";

export const DocumentListScreenContainer: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  const { db } = useDbContext();
  const [documents, setDocuments] = useState<DocumentObject[]>([]);

  useEffect(() => {
    db!.documents
      .find()
      .sort({ created: 1 })
      .$.subscribe(setDocuments);
  }, [true]);

  const navigateToDoc = (id: string): boolean =>
    navigation.navigate("LocalDocumentScreen", { id });

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
      <BottomNav navigation={navigation} />
    </ScreenView>
  );
};
