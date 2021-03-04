import React from "react";
import { storiesOf } from "@storybook/react-native";
import { TopBackground } from "../../../src/components/Layout/TopBackground";
import { AppMode } from "../../../src/context/config";

storiesOf("Layout", module).add("TopBackgroundProduction", () => (
  <TopBackground />
));

storiesOf("Layout", module).add("TopBackgroundStaging", () => (
  <TopBackground mode={AppMode.staging} />
));
