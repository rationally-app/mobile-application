import React, { FunctionComponent } from "react";
import { AppText } from "../Layout/AppText";
import { AuthCredentials } from "../../types";
import { StyleSheet, View } from "react-native";
import { Card } from "../Layout/Card";
import { fontSize, color, size } from "../../common/styles";
import { format } from "date-fns";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const styles = StyleSheet.create({
  card: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0
  },
  contentPaddingWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: size(3),
    paddingBottom: size(4),
    paddingHorizontal: size(3)
  },
  content: {
    flexGrow: 1,
    flexShrink: 1
  },
  campaignName: {
    fontFamily: "brand-bold",
    fontSize: fontSize(3)
  },
  operatorId: {
    marginTop: size(0.5),
    fontSize: fontSize(-3),
    color: color("blue", 40)
  },
  expiry: {
    marginTop: size(2),
    fontSize: fontSize(-2)
  },
  iconIndicator: {
    marginRight: -size(1)
  }
});

export const CampaignLocationsListItem: FunctionComponent<
  AuthCredentials & { name: string; onPress: () => void }
> = ({ name, expiry, operatorToken, onPress }) => {
  const operatorId = operatorToken.slice(0, 6); // May be blank for existing users because we didn't store operatorToken
  const formattedExpiry = format(expiry, "d MMM yyyy, h:mma");

  // TODO: handle expired style

  return (
    <Card style={styles.card}>
      <TouchableOpacity style={{ overflow: "visible" }} onPress={onPress}>
        <View style={styles.contentPaddingWrapper}>
          <View style={styles.content}>
            <AppText style={styles.campaignName}>{name}</AppText>
            {operatorId ? (
              <AppText style={styles.operatorId}>ID: {operatorId}</AppText>
            ) : null}
            <AppText style={styles.expiry}>
              Expires on {formattedExpiry}
            </AppText>
          </View>
          <Feather
            style={styles.iconIndicator}
            name="chevron-right"
            size={size(3)}
            color={color("blue", 40)}
          />
        </View>
      </TouchableOpacity>
    </Card>
  );
};
