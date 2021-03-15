import React from "react";
import { storiesOf } from "@storybook/react-native";
import { TopBackground } from "../../../src/components/Layout/TopBackground";
import { AppMode } from "../../../src/context/config";

storiesOf("Layout/TopBackground", module)
  .add("Production", () => <TopBackground />)
  .add("Staging", () => <TopBackground mode={AppMode.staging} />);
