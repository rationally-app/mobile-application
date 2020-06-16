import React, { FunctionComponent } from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "../Layout/AppText";
import { size, color, fontSize } from "../../common/styles";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { MaterialIcons } from "@expo/vector-icons";
import { InputWithLabel } from "../Layout/InputWithLabel";
<<<<<<< HEAD
import { ValidVoucherCount } from "./ValidVoucherCount";
import { Voucher } from "./MerchantPayoutScreen";
=======
import { VoucherChip } from "./VoucherChip";
>>>>>>> 0d3bff6... feat: added vouchersView for base merchant payout screen

const styles = StyleSheet.create({
  scanButtonWrapper: {
    marginTop: size(3)
  },
  horizontalRule: {
    borderBottomColor: color("grey", 30),
    marginHorizontal: -size(0.5),
    borderBottomWidth: 1
  },
<<<<<<< HEAD
  horizontalRuleWrapper: {
    marginTop: size(4)
  },
  inputWrapper: {
    marginTop: size(4),
    flex: 1
  },
  seeAllText: {
    fontFamily: "brand-italic"
=======
  horizontalRuleWrapper:{
    marginTop: size(4),
  },
  inputWrapper: {
    marginTop: size(4),
    flex: 1,
  },
  seeAllText: {
    fontFamily: "brand-italic",
>>>>>>> 0d3bff6... feat: added vouchersView for base merchant payout screen
  },
  seeAllTextWrapper: {
    marginLeft: "auto"
  },
  voucherChipWrapper: {
    flexDirection: "row"
  }
});

interface VoucherInputSection {
  vouchers: Voucher[];
  merchantCode: string;
  setMerchantCode: (merchantCode: string) => void;
  redeemVouchers: () => void;
}

export const VoucherInputSection: FunctionComponent<VoucherInputSection> = ({
  vouchers,
  merchantCode,
  setMerchantCode,
  redeemVouchers
}) => {
  return (
    <>
      {vouchers.length > 0 ? (
        <View style={styles.voucherChipWrapper}>
          <ValidVoucherCount
            denomination={vouchers[0].denomination}
            numVouchers={vouchers.length}
          />
          <View style={styles.seeAllTextWrapper}>
            <AppText style={styles.seeAllText}>See all</AppText>
          </View>
        </View>
      ) : (
        <AppText>Check the number of item(s) eligible for redemption</AppText>
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
      {vouchers.length > 0 && (
        <>
          <View style={styles.horizontalRuleWrapper}>
            <View style={styles.horizontalRule} />
          </View>
          <View style={styles.inputWrapper}>
            <InputWithLabel
              label="Merchant Code"
              value={merchantCode}
              onChange={({ nativeEvent: { text } }) => setMerchantCode(text)}
              onSubmitEditing={redeemVouchers}
            />
          </View>
        </>
      )}
    </>
  );
};
