import React from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { size } from "../../../src/common/styles";
import { Dropdown } from "../../../src/components/Layout/Dropdown";

const items: { id: string; name: string }[] = [
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
    <Dropdown
      label="Dropdown"
      items={items}
      onItemSelect={(item: any) => alert(JSON.stringify(item))}
    />
  </View>
));
