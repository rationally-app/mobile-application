import React, { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";
import { CustomerCard } from "../../CustomerQuota/CustomerCard";
import { size } from "../../../common/styles";
import { Card } from "../../Layout/Card";
import { ReasonSelectionHeader } from "./ReasonSelectionHeader";
import { ReasonItem } from "./ReasonItem";
import { SecondaryButton } from "../../Layout/Buttons/SecondaryButton";

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
  ids: string[];
  reasonSelectionHeader: string;
  reasons: string[];
  onCancel: () => void;
  onReasonSelection: (productName: string) => boolean;
}

export const ReasonSelectionCard: FunctionComponent<ReasonSelectionCard> = ({
  ids,
  reasonSelectionHeader,
  reasons,
  onCancel,
  onReasonSelection
}) => {
  return (
    <View>
      <CustomerCard ids={ids}>
        <Card>
          <View style={styles.common}>
            <ReasonSelectionHeader title={reasonSelectionHeader} />
          </View>
          <View style={styles.common}>
            {reasons.map(reason => (
              <ReasonItem
                key={reason}
                description={reason}
                isLast={reasons[reasons.length - 1] === reason}
                onReasonSelection={onReasonSelection}
              />
            ))}
          </View>
        </Card>
      </CustomerCard>
      <View style={styles.backbuttonComponent}>
        <SecondaryButton
          text="Back"
          onPress={() => onCancel()}
          fullWidth={true}
        />
      </View>
    </View>
  );
};
