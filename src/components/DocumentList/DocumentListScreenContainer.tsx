import React, { FunctionComponent, useState, useEffect } from "react";
import { DocumentObject, NavigationProps } from "../../types";
import { getData } from "@govtechsg/open-attestation";
import { useDbContext } from "../../context/db";
import { replaceRouteFn } from "../../common/navigation";
import { DocumentListScreen } from "./DocumentListScreen";

const getIssuerName = (document: DocumentObject): string => {
  const { issuers } = getData(document.document);
  return issuers[0]?.identityProof?.location;
};

export const DocumentListScreenContainer: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  const { db } = useDbContext();

  // undefined when the db hasn't fulfilled the initial find query
  const [documents, setDocuments] = useState<DocumentObject[]>();
  useEffect(() => {
    const subscription = db!.documents
      .find()
      .sort("created")
      .$.subscribe(setDocuments);
    return () => subscription.unsubscribe();
  }, [db]);

  const navigateToDoc = (id: string): boolean =>
    navigation.navigate("LocalDocumentScreen", { id });
  const navigateToScanner = replaceRouteFn(navigation, "QrScannerScreen");

  const documentItems = documents?.map((doc: DocumentObject) => {
    const docClear = getData(doc.document);
    return {
      id: doc.id,
      title: docClear.name,
      isVerified: doc.isVerified,
      lastVerification: doc.verified,
      issuedBy: getIssuerName(doc)
    };
  });
  return (
    <DocumentListScreen
      documentItems={documentItems}
      navigation={navigation}
      navigateToDoc={navigateToDoc}
      navigateToScanner={navigateToScanner}
    />
  );
};
