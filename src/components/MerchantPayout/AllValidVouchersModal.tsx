import React, { FunctionComponent, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import { size } from "../../common/styles";
import { Voucher } from "./MerchantPayoutScreen";
import { ValidVoucherCount } from "./ValidVoucherCount";
import { AppText } from "../Layout/AppText";
import { ScrollView } from "react-native-gesture-handler";
import { ModalWithClose } from "../Layout/ModalwithClose";

const styles = StyleSheet.create({
  card: {
    maxHeight: "80%"
  },
  removeText: {
    fontFamily: "brand-italic"
  },
  voucherItemWrapper: {
    flexDirection: "row",
    marginBottom: size(2),
    justifyContent: "space-between"
  },
  counterWrapper: {
    marginBottom: size(2),
    alignSelf: "flex-start"
  }
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
      <ScrollView>
        {vouchers.map(voucher => (
          <View key={voucher.serial} style={styles.voucherItemWrapper}>
            <AppText>{voucher.serial}</AppText>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Warning",
                  `Do you want to remove voucher(${voucher.serial})?`,
                  [
                    {
                      text: "No"
                    },
                    {
                      text: "Yes",
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
