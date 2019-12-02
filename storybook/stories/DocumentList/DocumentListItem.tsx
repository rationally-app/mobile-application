import React from "react";
import { CenterDecorator } from "../decorators";
import { storiesOf } from "@storybook/react-native";

import { DocumentListItem } from "../../../src/components/DocumentList/DocumentListItem";

storiesOf("DocumentList", module)
  .addDecorator(CenterDecorator)
  .add("DocumentListItem", () => (
    <DocumentListItem
      title="UAPL"
      isVerified={true}
      onPress={(): void => alert("Oink!")}
    />
  ));
