import React, { FunctionComponent } from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "../Layout/AppText";
import { Feather } from '@expo/vector-icons';
import { size, color, fontSize, borderRadius } from "../../common/styles";

const styles = StyleSheet.create({
  validText: {
    fontFamily: "brand-bold",
    fontSize: fontSize(-1)
  },
  validIcon: {
    marginRight: size(1)
  },
  validTextWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: size(1)
  },
  numVouchers: {
    fontFamily: "brand-bold",
    fontSize: fontSize(2),
    color: color("grey", 0)
  },
  numVouchersWrapper: {
    paddingHorizontal: size(1.5),
    paddingVertical: size(1),
    borderRadius: borderRadius(2)
  },
  validNumVouchersWrapper: {
    backgroundColor: color("blue-green", 40)
  },
  invalidNumVouchersWrapper: {
    backgroundColor: color("red", 60)
  }
});

interface VoucherChip {
  valid?: boolean,
  numVouchers: number
}

export const VoucherChip: FunctionComponent<VoucherChip> = ({
  valid = false,
  numVouchers
}) => {
  return (
    <View>
      <View style={styles.validTextWrapper}>
        <View style={styles.validIcon}>
          {valid ?
            <Feather name="check-circle" size={size(2)} color={color("blue", 50)} />
            :
            <Feather name="x-circle" size={size(2)} color={color("blue", 50)} />
          }
        </View>
        <AppText style={styles.validText}>
          {valid ?
            "Valid" : "Invalid"}
        </AppText>
      </View>
      <View style={[styles.numVouchersWrapper, valid ? styles.validNumVouchersWrapper : styles.invalidNumVouchersWrapper]}>
        <AppText style={styles.numVouchers}>
          {`${numVouchers} | $${numVouchers * 2}`}
        </AppText>
      </View>
    </View>
  );
};
