import { FunctionComponent } from "react";
import { View } from "react-native";
import { AppText } from "../../Layout/AppText";
import React from "react";

export const RedeemSuccessDetail: FunctionComponent<{}> = ({}) => {
  return (
    <View>
      <AppText>Citizen has redeemed the following range of vouchers:</AppText>
    </View>
  );
};
