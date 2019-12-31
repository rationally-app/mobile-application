import React from "react";
import { CenterVerticalDecorator } from "../decorators";
import { storiesOf } from "@storybook/react-native";

import { DocumentListItem } from "../../../src/components/DocumentList/DocumentListItem";

storiesOf("DocumentList", module)
  .addDecorator(CenterVerticalDecorator)
  .add("DocumentListItem", () => (
    <DocumentListItem
      title="UAPL"
      isVerified={true}
      onPress={(): void => alert("Oink!")}
    />
  ));
