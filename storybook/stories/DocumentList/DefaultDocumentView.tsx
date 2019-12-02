import React from "react";
import { storiesOf } from "@storybook/react-native";

import { EmptyDocumentList } from "../../../src/components/DocumentList/EmptyDocumentList";

const onAdd = (): void => alert("Add!");

storiesOf("DocumentList", module).add("EmptyDocumentList", () => (
  <EmptyDocumentList onAdd={onAdd} />
));
