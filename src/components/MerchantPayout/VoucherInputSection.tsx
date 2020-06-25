import React, { FunctionComponent } from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "../Layout/AppText";
import { size, color } from "../../common/styles";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { MaterialIcons } from "@expo/vector-icons";
import { InputWithLabel } from "../Layout/InputWithLabel";
import { ValidVoucherCount } from "./ValidVoucherCount";
import { Voucher } from "./MerchantPayoutScreen";
import { TouchableOpacity } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  scanButtonWrapper: {
    marginTop: size(3)
  },
  horizontalRule: {
    borderBottomColor: color("grey", 30),
    marginHorizontal: -size(3),
    borderBottomWidth: 1,
    marginTop: size(5)
  },
  inputWrapper: {
    marginTop: size(4),
    flex: 1
  },
  voucherChipWrapper: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  seeAllButton: {
    marginTop: -size(2),
    marginRight: -size(2),
    padding: size(2),
    alignItems: "center",
    justifyContent: "center"
  },
  seeAllText: {
    fontFamily: "brand-italic"
  }
});

interface VoucherInputSection {
  openCamera: () => void;
  vouchers: Voucher[];
  merchantCode: string;
  setMerchantCode: (merchantCode: string) => void;
  redeemVouchers: () => void;
  openAllValidVouchersModal: () => void;
}

export const VoucherInputSection: FunctionComponent<VoucherInputSection> = ({
  openCamera,
  vouchers,
  merchantCode,
  setMerchantCode,
  redeemVouchers,
  openAllValidVouchersModal
}) => {
  return (
    <>
      {vouchers.length > 0 ? (
        <View style={styles.voucherChipWrapper}>
          <ValidVoucherCount
            denomination={vouchers[0].denomination}
            numVouchers={vouchers.length}
          />
          <TouchableOpacity
            onPress={openAllValidVouchersModal}
            style={styles.seeAllButton}
          >
            <AppText style={styles.seeAllText}>See all</AppText>
          </TouchableOpacity>
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
          onPress={openCamera}
        />
      </View>
      {vouchers.length > 0 && (
        <>
          <View style={styles.horizontalRule} />
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
