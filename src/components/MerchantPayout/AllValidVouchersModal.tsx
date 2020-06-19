import React, { FunctionComponent, useEffect } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert
} from "react-native";
import { size, color } from "../../common/styles";
import { Card } from "../Layout/Card";
import { Voucher } from "./MerchantPayoutScreen";
import { ValidVoucherCount } from "./ValidVoucherCount";
import { Feather } from "@expo/vector-icons";
import { AppText } from "../Layout/AppText";
import { ScrollView } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: color("grey", 100),
    opacity: 0.8
  },
  cardWrapper: {
    padding: size(3),
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  card: {
    width: 512,
    maxHeight: "80%",
    maxWidth: "100%"
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
    marginRight: "auto"
  }
});

interface ManualInputCard {
  vouchers: Voucher[];
  isVisible: boolean;
  onVoucherCodeRemove: (voucherCode: string) => void;
  onExit: () => void;
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
    <Modal
      visible={isVisible}
      onRequestClose={onExit}
      animationType="fade"
      transparent={true}
    >
      <TouchableWithoutFeedback onPress={onExit}>
        <View style={styles.background} />
      </TouchableWithoutFeedback>
      <View style={styles.cardWrapper}>
        <Card style={styles.card}>
          <TouchableOpacity
            onPress={onExit}
            style={{
              position: "absolute",
              right: size(2),
              top: size(2),
              padding: size(1)
            }}
          >
            <Feather name="x" size={size(3)} color={color("blue", 50)} />
          </TouchableOpacity>
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
        </Card>
      </View>
    </Modal>
  );
};
