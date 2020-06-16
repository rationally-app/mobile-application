import React, { FunctionComponent } from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "../Layout/AppText";
import { size, color } from "../../common/styles";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { MaterialIcons } from "@expo/vector-icons";
import { InputWithLabel } from "../Layout/InputWithLabel";
import { VoucherChip } from "./VoucherChip";

const styles = StyleSheet.create({
  scanButtonWrapper: {
    marginTop: size(3)
  },
  horizontalRule: {
    borderBottomColor: color("grey", 30),
    marginHorizontal: -size(0.5),
    borderBottomWidth: 1
  },
  horizontalRuleWrapper: {
    marginTop: size(4)
  },
  inputWrapper: {
    marginTop: size(4),
    flex: 1
  },
  seeAllText: {
    fontFamily: "brand-italic"
  },
  seeAllTextWrapper: {
    marginLeft: "auto"
  },
  voucherChipWrapper: {
    flexDirection: "row"
  }
});

interface VoucherInputSection {
  vouchers: any;
  merchantCode: string;
  setMerchantCode: (merchantCode: string) => void;
  submitMerchantCode: () => void;
}

export const VoucherInputSection: FunctionComponent<VoucherInputSection> = ({
  vouchers,
  merchantCode,
  setMerchantCode,
  submitMerchantCode
}) => {
  return (
    <>
      {vouchers.length == 0 ? (
        <AppText>Check the number of item(s) eligible for redemption</AppText>
      ) : (
        <View style={styles.voucherChipWrapper}>
          <VoucherChip valid numVouchers={1} />
          <View style={styles.seeAllTextWrapper}>
            <AppText style={styles.seeAllText}>See all</AppText>
          </View>
        </View>
      )}
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
      {vouchers.length == 0 ? (
        <></>
      ) : (
        <>
          <View style={styles.horizontalRuleWrapper}>
            <View style={styles.horizontalRule} />
          </View>
          <View style={styles.inputWrapper}>
            <InputWithLabel
              label="Merchant Code"
              value={merchantCode}
              onChange={({ nativeEvent: { text } }) => setMerchantCode(text)}
              onSubmitEditing={submitMerchantCode}
            />
          </View>
        </>
      )}
    </>
  );
};
