import React from "react";
import { storiesOf } from "@storybook/react-native";
import { Settings } from "../../../src/components/Settings/Settings";

const onResetDocumentData = (): void => alert("Data Reset");
const navigation: any = {
  dispatch: (action: any) => alert(JSON.stringify(action))
};

storiesOf("Settings", module).add("Settings", () => (
  <Settings navigation={navigation} onResetDocumentData={onResetDocumentData} />
));
