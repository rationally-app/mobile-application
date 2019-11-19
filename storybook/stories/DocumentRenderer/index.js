import React from "react";
import { storiesOf } from "@storybook/react-native";
import { CenterDecorator } from "../decorators";

import { ScreenView } from "../../../src/components/ScreenView";
import { DocumentRenderer } from "../../../src/components/DocumentRenderer/DocumentRenderer";
import { DocumentRendererHeader } from "../../../src/components/DocumentRenderer/DocumentRendererHeader";
import demoOc from "../../../fixtures/demo-oc.json";
import demoCaas from "../../../fixtures/demo-caas.json";
import demoEbl from "../../../fixtures/demo-ebl.json";

const mockBack = () => {
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

const tabs = [
  { id: "tab-1", label: "Tab 1" },
  { id: "tab-2", label: "Tab 2" }
];

const generateTabs = numTabs =>
  new Array(numTabs)
    .fill({})
    .map((_elm, index) => ({ id: `tab-${index}`, label: `Tab ${index}` }));

storiesOf("DocumentRenderer", module)
  .addDecorator(CenterDecorator)
  .add("DocumentRendererHeader", () => (
    <>
      <DocumentRendererHeader
        tabs={generateTabs(3)}
        activeTabId="tab-2"
        tabSelect={() => {}}
        goBack={mockBack}
      />
      <DocumentRendererHeader
        tabs={generateTabs(10)}
        activeTabId="tab-2"
        tabSelect={() => {}}
        goBack={mockBack}
      />
    </>
  ));
