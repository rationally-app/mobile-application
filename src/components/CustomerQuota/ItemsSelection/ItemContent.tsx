import React, { FunctionComponent, memo } from "react";
import { StyleSheet } from "react-native";
import { AppText } from "../../Layout/AppText";
import { CampaignPolicy } from "../../../types";
import { ItemMaxUnitLabel } from "./ItemMaxUnitLabel";
import { fontSize, color } from "../../../common/styles";
import { sharedStyles } from "./sharedStyles";

const styles = StyleSheet.create({
  name: {
    fontSize: fontSize(1),
    fontFamily: "brand-bold"
  },
  description: {
    fontSize: fontSize(0)
  },
  descriptionAlert: {
    fontFamily: "brand-italic",
    color: color("red", 50)
  }
});

export const ItemContent: FunctionComponent<{
  name: CampaignPolicy["name"];
  description: CampaignPolicy["description"];
  descriptionAlert?: string;
  unit: CampaignPolicy["quantity"]["unit"];
  maxQuantity: number;
  // eslint-disable-next-line react/display-name
}> = memo(({ name, description, descriptionAlert, unit, maxQuantity }) => (
  <>
    <AppText style={styles.name}>{name}</AppText>
    {descriptionAlert && descriptionAlert.length > 0 && (
      <AppText style={styles.descriptionAlert}>{descriptionAlert}</AppText>
    )}
    {(description ?? "").length > 0 && (
      <AppText style={styles.description}>{description}</AppText>
    )}
    {maxQuantity === 1 && (
      <AppText style={sharedStyles.maxQuantityLabel}>
        <ItemMaxUnitLabel unit={unit} maxQuantity={maxQuantity} />
      </AppText>
    )}
  </>
));
