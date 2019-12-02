import React, { FunctionComponent, useEffect, useState } from "react";
import { View } from "react-native";
import { useDbContext } from "../../context/db";
import { DocumentObject, NavigationProps } from "../../types";
import { DocumentRenderer } from "./DocumentRenderer";
import { DocumentDetailsSheet } from "./DocumentDetailsSheet";
import { LoadingView } from "../Loading";
import { ScreenView } from "../ScreenView";

export const LocalDocumentRendererContainer: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  const id = navigation.getParam("id");
  const { db } = useDbContext();
  const [document, setDocument] = useState<DocumentObject>();

  useEffect(() => {
    const subscription = db!.documents
      .findOne({ id: { $eq: id } })
      .$.subscribe(setDocument);
    return () => subscription.unsubscribe();
  }, [db, id]);

  const output = document ? (
    <View style={{ flex: 1 }}>
      <DocumentRenderer
        document={document.document}
        goBack={() => navigation.goBack()}
      />
      <DocumentDetailsSheet document={document.document} />
    </View>
  ) : (
    <LoadingView />
  );

  return <ScreenView>{output}</ScreenView>;
};
