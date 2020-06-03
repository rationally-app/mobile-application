import React, { FunctionComponent, useState } from "react";
import { InputWithLabel } from "../../Layout/InputWithLabel";
import { DarkButton } from "../../Layout/Buttons/DarkButton";
import { View, StyleSheet } from "react-native";
import { size, color } from "../../../common/styles";
import { Feather } from "@expo/vector-icons";

const styles = StyleSheet.create({
  inputAndButtonWrapper: {
    flexDirection: "row",
    alignItems: "flex-end"
  },
  inputWrapper: {
    flex: 1,
    marginRight: size(1)
  }
});

export const ItemIdentifier: FunctionComponent<{
  label: string;
}> = ({ label }) => {
  const [voucherCodeInput, setVoucherCodeInput] = useState<string>("");

  return (
    <>
      <View style={styles.inputAndButtonWrapper}>
        <View style={styles.inputWrapper}>
          <InputWithLabel
            label={label}
            value={voucherCodeInput}
            onChange={({ nativeEvent: { text } }) => setVoucherCodeInput(text)}
          />
        </View>

        <DarkButton
          text="Scan"
          icon={
            <Feather name="maximize" size={size(2)} color={color("grey", 0)} />
          }
          onPress={() => null} // TODO: openCamera
        />
      </View>
    </>
  );
};
