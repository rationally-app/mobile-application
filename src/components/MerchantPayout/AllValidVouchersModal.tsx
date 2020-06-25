import React, { FunctionComponent, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import { size, fontSize, color } from "../../common/styles";
import { Voucher } from "./MerchantPayoutScreen";
import { ValidVoucherCount } from "./ValidVoucherCount";
import { AppText } from "../Layout/AppText";
import { ScrollView } from "react-native-gesture-handler";
import { ModalWithClose } from "../Layout/ModalwithClose";

const styles = StyleSheet.create({
  card: {
    maxHeight: "80%"
  },
  counterWrapper: {
    alignSelf: "flex-start"
  },
  voucherList: {
    marginHorizontal: -size(3),
    paddingHorizontal: size(3),
    marginTop: size(3)
  },
  voucherItemWrapper: {
    flexDirection: "row",
    marginBottom: size(1),
    justifyContent: "space-between",
    alignItems: "center"
  },
  guideline: {
    flexGrow: 1,
    marginHorizontal: size(1.5),
    borderBottomColor: color("grey", 20),
    borderBottomWidth: 1
  },
  serialNumber: {
    fontFamily: "brand-bold",
    fontSize: fontSize(1)
  },
  removeText: {}
});

interface ManualInputCard extends ModalWithClose {
  vouchers: Voucher[];
  onVoucherCodeRemove: (voucherCode: string) => void;
}

export const AllValidVouchersModal: FunctionComponent<ManualInputCard> = ({
  vouchers,
  isVisible,
  onExit,
  onVoucherCodeRemove
}) => {
  useEffect(() => {
    if (vouchers.length === 0) {
      onExit();
    }
  }, [onExit, vouchers]);

  return (
    <ModalWithClose isVisible={isVisible} onExit={onExit} style={styles.card}>
      <View style={styles.counterWrapper}>
        <ValidVoucherCount
          denomination={vouchers.length > 0 ? vouchers[0].denomination : 0}
          numVouchers={vouchers.length}
        />
      </View>
      <ScrollView style={styles.voucherList}>
        {vouchers.map(voucher => (
          <View key={voucher.serial} style={styles.voucherItemWrapper}>
            <AppText style={styles.serialNumber}>{voucher.serial}</AppText>
            <View style={styles.guideline}></View>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Remove item?",
                  `Do you want to remove this item: ${voucher.serial}?`,
                  [
                    {
                      text: "Cancel"
                    },
                    {
                      text: "Remove",
                      onPress: () => {
                        onVoucherCodeRemove(voucher.serial);
                      },
                      style: "destructive"
                    }
                  ]
                );
              }}
            >
              <AppText style={styles.removeText}>Remove</AppText>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </ModalWithClose>
  );
};
