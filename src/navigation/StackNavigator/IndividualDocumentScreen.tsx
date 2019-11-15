import React, { useEffect, useState, FunctionComponent } from "react";
import { NavigationProps, DocumentObject } from "../../types";
import { useDbContext } from "../../context/db";
import { DocumentRendererScreenContainer } from "../../components/DocumentRenderer/DocumentRendererScreenContainer";

const IndividualDocumentScreen: FunctionComponent<NavigationProps> = ({
  navigation
}: NavigationProps) => {
  const id = navigation.getParam("id");
  const { db } = useDbContext();
  const [document, setDocument] = useState<DocumentObject>();

  useEffect(() => {
    db!.documents.findOne({ id: { $eq: id } }).$.subscribe(setDocument);
  }, [true]);

  return (
    <DocumentRendererScreenContainer
      document={document}
      navigation={navigation}
    />
  );
};

export default IndividualDocumentScreen;
