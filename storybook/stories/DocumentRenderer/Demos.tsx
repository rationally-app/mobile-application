import React from "react";
import { storiesOf } from "@storybook/react-native";

import { ScreenView } from "../../../src/components/ScreenView";
import { DocumentRenderer } from "../../../src/components/DocumentRenderer/DocumentRenderer";
import demoOc from "../../../fixtures/demo-oc.json";
import demoCaas from "../../../fixtures/demo-caas.json";
import demoEbl from "../../../fixtures/demo-ebl.json";

const mockBack = (): void => {
  alert("Back!");
};

storiesOf("DocumentRenderer", module).add("Demo - OpenCerts", () => (
  <ScreenView>
    <DocumentRenderer document={demoOc} goBack={mockBack} />
  </ScreenView>
));

storiesOf("DocumentRenderer", module).add("Demo - UALP", () => (
  <ScreenView>
    <DocumentRenderer document={demoCaas} goBack={mockBack} />
  </ScreenView>
));

storiesOf("DocumentRenderer", module).add("Demo - eBL", () => (
  <ScreenView>
    <DocumentRenderer document={demoEbl} goBack={mockBack} />
  </ScreenView>
));
