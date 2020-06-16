import React, { FunctionComponent } from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "../Layout/AppText";
import { size, color } from "../../common/styles";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { MaterialIcons } from "@expo/vector-icons";

const styles = StyleSheet.create({
  scanButtonWrapper: {
    marginTop: size(4),
  }
});

export const VoucherInputSection: FunctionComponent = () => {
  return (
    <>
      <AppText>
        Check the number of item(s) eligible for redemption
      </AppText>
      <View style={styles.scanButtonWrapper}>
        <DarkButton
          fullWidth={true}
          text="Add voucher"
          icon={
            <MaterialIcons name="add" size={size(2)} color={color("grey", 0)} />
          }
        // onPress={openCamera}
        />
      </View>
    </>
  );
};
