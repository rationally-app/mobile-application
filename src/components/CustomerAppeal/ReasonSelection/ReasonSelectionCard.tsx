import React, { FunctionComponent, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { CustomerCard } from "../../CustomerQuota/CustomerCard";
import { size } from "../../../common/styles";
import { Card } from "../../Layout/Card";
import { ReasonSelectionHeader } from "./ReasonSelectionHeader";
import { ReasonItem } from "./ReasonItem";
import { SecondaryButton } from "../../Layout/Buttons/SecondaryButton";
import {
  AlertModalContext,
  getTranslationKeyFromMessage
} from "../../../context/alert";
import i18n from "i18n-js";

const styles = StyleSheet.create({
  titlePadding: {
    padding: size(2),
    paddingTop: size(0.5)
  },
  reasonPadding: {
    paddingTop: size(0.5)
  },
  backbuttonComponent: {
    marginTop: size(5)
  }
});

export type Reason = {
  description: string;
  descriptionAlert: string | undefined;
};

interface ReasonSelectionCard {
  ids: string[];
  reasonSelectionHeader: string;
  reasons: Reason[];
  onCancel: () => void;
  onReasonSelection: (productName: string) => void;
}

export const ReasonSelectionCard: FunctionComponent<ReasonSelectionCard> = ({
  ids,
  reasonSelectionHeader,
  reasons,
  onCancel,
  onReasonSelection
}) => {
  const { showWarnAlert } = useContext(AlertModalContext);
  return (
    <View>
      <CustomerCard ids={ids}>
        <Card>
          <View style={styles.titlePadding}>
            <ReasonSelectionHeader title={reasonSelectionHeader} />
          </View>
          <View style={styles.reasonPadding}>
            {reasons.map(reason => (
              <ReasonItem
                key={reason.description}
                description={reason.description}
                descriptionAlert={reason.descriptionAlert}
                isLast={reasons[reasons.length - 1] === reason}
                onReasonSelection={onReasonSelection}
              />
            ))}
          </View>
        </Card>
      </CustomerCard>
      <View style={styles.backbuttonComponent}>
        <SecondaryButton
          text={i18n.t("customerQuotaScreen.quotaAppealCancel")}
          onPress={() => {
            showWarnAlert(new Error("cancelEntry"), onCancel);
          }}
          fullWidth={true}
        />
      </View>
    </View>
  );
};
