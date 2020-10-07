import React, { FunctionComponent } from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "../Layout/AppText";
import { Feather } from "@expo/vector-icons";
import { size, color, fontSize, borderRadius } from "../../common/styles";
import { getTranslatedStringWithI18n } from "../../utils/translations";

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
    alignItems: "center"
  },
  numVouchers: {
    color: color("grey", 0),
    fontFamily: "brand-bold",
    fontSize: fontSize(2),
    lineHeight: fontSize(3)
  },
  numVouchersWrapper: {
    flexDirection: "row",
    marginTop: size(0.5),
    paddingHorizontal: size(1.5),
    paddingVertical: size(1),
    borderRadius: borderRadius(2),
    backgroundColor: color("blue-green", 40)
  },
  divider: {
    borderRightWidth: 1,
    borderRightColor: color("grey", 30),
    marginHorizontal: size(1.5)
  }
});

interface ValidVoucherCount {
  numVouchers: number;
  denomination: number;
}

export const ValidVoucherCount: FunctionComponent<ValidVoucherCount> = ({
  numVouchers,
  denomination
}) => {
  return (
    <View>
      <View style={styles.validTextWrapper}>
        <View style={styles.validIcon}>
          <Feather
            name="check-circle"
            size={size(2)}
            color={color("blue", 50)}
          />
        </View>
        <AppText style={styles.validText}>
          {getTranslatedStringWithI18n("checkoutSuccessScreen", "valid")}
        </AppText>
      </View>
      <View style={styles.numVouchersWrapper}>
        <AppText style={styles.numVouchers}>{numVouchers}</AppText>
        <View style={styles.divider}></View>
        <AppText style={styles.numVouchers}>
          ${numVouchers * denomination}
        </AppText>
      </View>
    </View>
  );
};
