import React, { ReactElement, useState, FunctionComponent } from "react";
import { storiesOf } from "@storybook/react-native";
import { BottomSheet } from "../../../src/components/Layout/BottomSheet";
import { View, Text, LayoutChangeEvent } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { letterSpacing, borderRadius } from "../../../src/common/styles";

const Lorem = (): ReactElement => (
  <View>
    <Text>
      At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
      praesentium voluptatum deleniti atque corrupti quos dolores et quas
      molestias excepturi sint occaecati cupiditate non provident, similique
      sunt in culpa qui officia deserunt mollitia animi, id est laborum et
      dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
    </Text>
  </View>
);

const Example: FunctionComponent = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const onHeaderLayout = (event: LayoutChangeEvent): void => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height + 72);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "darkturquoise" }}>
      <BottomSheet snapPoints={[headerHeight, "80%"]}>
        {openSheet => (
          <View>
            <View
              onLayout={onHeaderLayout}
              style={{
                paddingBottom: 32
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, marginBottom: 8 }}>
                    Issued by
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: letterSpacing(1)
                    }}
                  >
                    Civil Aviation Authority of Singapore
                  </Text>
                </View>
                <RectButton
                  onPress={openSheet}
                  style={{
                    backgroundColor: "#F2F2F2",
                    height: 48,
                    width: 48,
                    borderRadius: borderRadius(3),
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <View accessible>
                    <Ionicons name="md-share" size={24} />
                  </View>
                </RectButton>
              </View>
            </View>
            <View
              style={{
                width: "100%",
                aspectRatio: 1,
                backgroundColor: "#f2f2f2",
                marginBottom: 24
              }}
            />
            <Lorem />
          </View>
        )}
      </BottomSheet>
    </View>
  );
};

storiesOf("Layout", module).add("BottomSheet", () => <Example />);
