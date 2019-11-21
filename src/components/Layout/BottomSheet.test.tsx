import React from "react";
import { render } from "@testing-library/react-native";
import { BottomSheet } from "./BottomSheet";
import { View, Text } from "react-native";

describe("BottomSheet", () => {
  it("should render its children properly", () => {
    expect.assertions(1);
    const testContent = "content";
    const component = render(
      <BottomSheet>
        <View>
          <Text>{testContent}</Text>
        </View>
      </BottomSheet>
    );
    expect(component.queryByText(testContent)).not.toBeNull();
  });

  it("should render the drag indicator", () => {
    expect.assertions(1);
    const component = render(
      <BottomSheet>
        <View>
          <Text>content</Text>
        </View>
      </BottomSheet>
    );
    expect(component.queryByTestId("drag-indicator")).not.toBeNull();
  });
});
