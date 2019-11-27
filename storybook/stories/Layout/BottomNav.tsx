import React from "react";
import { storiesOf } from "@storybook/react-native";
import { CenterVerticalDecorator } from "../decorators";
import { BottomNav } from "../../../src/components/Layout/BottomNav";

const mockNavigation: any = {
  dispatch: (action: any) => alert(JSON.stringify(action))
};

storiesOf("Layout", module)
  .addDecorator(CenterVerticalDecorator)
  .add("BottomNav", () => (
    <>
      <BottomNav navigation={mockNavigation} />
    </>
  ));
