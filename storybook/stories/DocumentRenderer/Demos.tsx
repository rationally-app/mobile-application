import React from "react";
import { storiesOf } from "@storybook/react-native";

import { DocumentRenderer } from "../../../src/components/DocumentRenderer/DocumentRenderer";
import demoOc from "../../../fixtures/demo-oc.json";
import demoCaas from "../../../fixtures/demo-caas.json";
import demoEbl from "../../../fixtures/demo-ebl.json";

const mockBack = (): void => {
  alert("Back!");
};

storiesOf("DocumentRenderer", module)
  .add("Demo - OpenCerts", () => (
    <DocumentRenderer document={demoOc} goBack={mockBack} />
  ))
  .add("Demo - UALP", () => (
    <DocumentRenderer document={demoCaas} goBack={mockBack} />
  ))
  .add("Demo - eBL", () => (
    <DocumentRenderer document={demoEbl} goBack={mockBack} />
  ));
