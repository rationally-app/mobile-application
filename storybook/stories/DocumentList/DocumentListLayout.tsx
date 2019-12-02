import React from "react";
import { storiesOf } from "@storybook/react-native";
import { DocumentListLayout } from "../../../src/components/DocumentList/DocumentListLayout";
import { documents } from "./data";
import { navigation } from "../mocks/navigation";

const navigateToDoc = (id: string): boolean => {
  alert(`Going to doc ${id}`);
  return true;
};

const navigateToScanner = (): void => alert("Going to scanner");

storiesOf("DocumentList", module).add("DocumentListLayout (Empty)", () => (
  <DocumentListLayout
    documentItems={[]}
    navigateToDoc={navigateToDoc}
    navigateToScanner={navigateToScanner}
    navigation={navigation}
  />
));

storiesOf("DocumentList", module).add("DocumentListLayout (Populated)", () => (
  <DocumentListLayout
    documentItems={documents}
    navigateToDoc={navigateToDoc}
    navigateToScanner={navigateToScanner}
    navigation={navigation}
  />
));
