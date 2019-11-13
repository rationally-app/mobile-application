import React, { useEffect, useState, FunctionComponent } from "react";
import { Text, View } from "react-native";
import { NavigationProps } from "../types";
import { useDbContext } from "../../context/db";
import { get } from "lodash";

const MainScreen: FunctionComponent<NavigationProps> = () => {
  const { db } = useDbContext();
  const [documents, setDocuments] = useState();

  useEffect(() => {
    db!.documents
      .find()
      .sort({ created: 1 })
      .$.subscribe(setDocuments);
  }, [true]);

  const titles =
    documents &&
    documents.map((doc: any) => get(doc, "document.signature.targetHash"));

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>{JSON.stringify(titles)}</Text>
    </View>
  );
};

export default MainScreen;
