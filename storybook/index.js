import React from "react";
import {
  getStorybookUI,
  configure,
  addDecorator
} from "@storybook/react-native";
import { FontLoader } from "../src/components/FontLoader";
import "./rn-addons";
import "./config";

// import stories
configure(() => {
  require("./stories");
}, module);

// Refer to https://github.com/storybookjs/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({ asyncStorage: null });

addDecorator(storyFn => <FontLoader>{storyFn()}</FontLoader>);

export default StorybookUIRoot;
