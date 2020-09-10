import React, { FunctionComponent } from "react";
import { AppText } from "../Layout/AppText";
import { AuthCredentials } from "../../types";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { fontSize, color, size } from "../../common/styles";
import { formatDateTime } from "../../utils/dateTimeFormatter";

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    flexShrink: 1,
    paddingHorizontal: size(3),
    paddingVertical: size(2.5),
    backgroundColor: color("grey", 10)
  },
  campaignName: {
    fontFamily: "brand-bold",
    fontSize: fontSize(1)
  },
  operatorId: {
    marginTop: size(1.5),
    fontSize: fontSize(-2)
  },
  expiry: {
    fontSize: fontSize(-2)
  }
});

export const CampaignLocationsListItem: FunctionComponent<
  AuthCredentials & { name: string; onPress: () => void }
> = ({ name, expiry, operatorToken, onPress }) => {
  const operatorId = operatorToken.slice(0, 6); // May be blank for existing users because we didn't store operatorToken previously
  const formattedExpiry = formatDateTime(expiry);

  const hasExpired = Date.now() >= expiry;

  return (
    <TouchableOpacity onPress={onPress} disabled={hasExpired}>
      <View style={styles.content}>
        <AppText
          style={[
            styles.campaignName,
            hasExpired ? { color: color("grey", 40) } : {}
          ]}
        >
          {name}
        </AppText>
        {operatorId ? (
          <AppText
            style={[
              styles.operatorId,
              hasExpired ? { color: color("grey", 40) } : {}
            ]}
          >
            ID: {operatorId}
          </AppText>
        ) : null}
        <AppText
          style={[
            styles.expiry,
            hasExpired ? { color: color("grey", 40) } : {}
          ]}
        >
          {hasExpired ? "Expired on " : "Valid till "}
          {formattedExpiry}
        </AppText>
      </View>
    </TouchableOpacity>
  );
};
