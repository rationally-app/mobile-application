import React from "react";
import { storiesOf } from "@storybook/react-native";
import { CenterDecorator } from "../decorators";
import { DocumentRendererHeader } from "../../../src/components/DocumentRenderer/DocumentRendererHeader";

const mockBack = (): void => {
  alert("Back!");
};

const generateTabs = (numTabs: number): { id: string; label: string }[] =>
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
