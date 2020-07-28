import React, { FunctionComponent, useState } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { CustomerCard } from "../CustomerQuota/CustomerCard";
import { size, color } from "../../common/styles";
import { Feather } from "@expo/vector-icons";
import { AppText } from "../Layout/AppText";
import { Card } from "../Layout/Card";
import { ReasonSelectionHeader } from "./ReasonSelectionHeader";
import { Reason } from "./Reason";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";

const styles = StyleSheet.create({
  common: {
    padding: size(2),
    paddingTop: size(0.5)
  },
  backbuttonComponent: {
    marginTop: size(5)
  }
});

interface ReasonSelectionCard {
  reasonSelectionHeader: string;
  reasons: string[];
}

export const ReasonSelectionCard: FunctionComponent<ReasonSelectionCard> = ({
  reasonSelectionHeader,
  reasons
}) => {
  return (
    <View>
      <CustomerCard ids={["S1234567G"]}>
        <Card>
          <View style={styles.common}>
            <ReasonSelectionHeader title={reasonSelectionHeader} />
          </View>
          <View style={styles.common}>
            {reasons.map(reason => (
              <Reason
                key={reason}
                description={reason}
                isLast={reasons[reasons.length - 1] === reason}
              />
            ))}
          </View>
        </Card>
      </CustomerCard>
      <View style={styles.backbuttonComponent}>
        <SecondaryButton
          text="Back"
          onPress={() => console.warn("onpress")}
          fullWidth={true}
        />
      </View>
    </View>
  );
};
