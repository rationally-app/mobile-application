import React from "react";
import { storiesOf } from "@storybook/react-native";
import { DocumentList } from "../../../src/components/DocumentList/DocumentList";
import { documents } from "./data";

storiesOf("DocumentList", module).add("DocumentListView", () => (
  <DocumentList documents={documents} navigateToDoc={alert} />
));
