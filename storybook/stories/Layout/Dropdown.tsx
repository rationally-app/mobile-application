import React from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { size } from "../../../src/common/styles";
import { DropdownItem } from "../../../src/components/DropdownFilterModal/DropdownFilterModal";
import { DropdownFilterInput } from "../../../src/components/DropdownFilterModal/DropdownFilterInput";

const items: DropdownItem[] = [
  //name key is must.It is to show the text in front
  { id: "A1", name: "angellist" },
  { id: "A2", name: "codepen" },
  { id: "A3", name: "envelope" },
  { id: "A4", name: "etsy" },
  { id: "A5", name: "facebook" },
  { id: "A6", name: "foursquare" },
  { id: "A7", name: "github-alt" },
  { id: "A8", name: "github" },
  { id: "A9", name: "gitlab" },
  { id: "A10", name: "instagram" }
];

storiesOf("Layout", module).add("Dropdown", () => (
  <View style={{ margin: size(3) }}>
    <DropdownFilterInput
      label="Dropdown label"
      placeholder="placeholder"
      dropdownItems={items}
      onItemSelection={item => alert(JSON.stringify(item))}
    />
  </View>
));
