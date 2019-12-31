import React from "react";
import { storiesOf } from "@storybook/react-native";
import { Settings } from "../../../src/components/Settings/Settings";
import { navigation } from "../mocks/navigation";

const onResetDocumentData = (): void => alert("Data Reset");

storiesOf("Settings", module).add("Settings", () => (
  <Settings navigation={navigation} onResetDocumentData={onResetDocumentData} />
));
