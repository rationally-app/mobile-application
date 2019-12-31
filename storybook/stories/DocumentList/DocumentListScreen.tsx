import React from "react";
import { storiesOf } from "@storybook/react-native";
import { DocumentListScreen } from "../../../src/components/DocumentList/DocumentListScreen";
import { documents } from "./data";
import { navigation } from "../mocks/navigation";

const navigateToDoc = (id: string): boolean => {
  alert(`Going to doc ${id}`);
  return true;
};

const navigateToScanner = (): void => alert("Going to scanner");

storiesOf("DocumentList", module)
  .add("DocumentListScreen (Empty)", () => (
    <DocumentListScreen
      documentItems={[]}
      navigateToDoc={navigateToDoc}
      navigateToScanner={navigateToScanner}
      navigation={navigation}
    />
  ))
  .add("DocumentListScreen (Populated)", () => (
    <DocumentListScreen
      documentItems={documents}
      navigateToDoc={navigateToDoc}
      navigateToScanner={navigateToScanner}
      navigation={navigation}
    />
  ));
