import React, { FunctionComponent } from "react";
import { NavigationProps, DocumentObject } from "../../types";
import { DocumentRenderer } from "./DocumentRenderer";
import { ScreenView } from "../ScreenView";
import { SignedDocument, getData } from "@govtechsg/open-attestation";
import { ScannedDocumentActionSheet } from "./ScannedDocumentActionSheet";
import { useDbContext } from "../../context/db";
import { resetRouteFn } from "../../common/navigation";
import { useDocumentVerifier } from "../../common/hooks/useDocumentVerifier";
import { CheckStatus } from "../../constants/verifier";

export const ScannedDocumentRendererContainer: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  const { db } = useDbContext();
  const document: SignedDocument = navigation.getParam("document");
  const isSavable: boolean = navigation.getParam("savable");
  const verificationStatuses = useDocumentVerifier(document as SignedDocument);

  const documentData = getData(document);
  const id = document.signature.targetHash;
  const issuedBy =
    documentData.issuers[0]?.identityProof?.location ||
    "Issuer's identity not found";
  const navigateToDocument = resetRouteFn(navigation, "LocalDocumentScreen", {
    id
  });
  const onSave = async (): Promise<void> => {
    try {
      const documentToInsert: DocumentObject = {
        id,
        created: Date.now(),
        document,
        verified: Date.now(),
        isVerified: verificationStatuses.overallValidity === CheckStatus.VALID
      };
      await db!.documents.insert(documentToInsert);
      navigateToDocument();
    } catch (e) {
      if (e?.parameters?.pouchDbError?.name === "conflict") {
        alert("The document has already been saved");
        return;
      }
      throw e;
    }
  };

  return (
    <>
      <ScreenView>
        <DocumentRenderer
          document={document}
          goBack={() => navigation.goBack()}
        />
      </ScreenView>
      <ScannedDocumentActionSheet
        verificationStatuses={verificationStatuses}
        issuedBy={issuedBy}
        isSavable={isSavable}
        onCancel={() => navigation.goBack()}
        onDone={() => navigation.goBack()}
        onSave={onSave}
      />
    </>
  );
};
