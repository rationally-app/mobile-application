import React, { FunctionComponent, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "../../Layout/AppText";
import { CampaignPolicy } from "../../../types";
import { ItemMaxUnitLabel } from "./ItemMaxUnitLabel";
import { fontSize, color } from "../../../common/styles";
import { sharedStyles } from "./sharedStyles";
import { CampaignConfigContext } from "../../../context/campaignConfig";

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
}> = ({ name, description, descriptionAlert, unit, maxQuantity }) => {
  const { c13n } = useContext(CampaignConfigContext);

  const translatedName = c13n[name] ?? name;
  const translatedDescription =
    (description && c13n[description]) ?? description ?? "";
  return (
    <View>
      <AppText style={styles.name}>{translatedName}</AppText>
      {descriptionAlert && descriptionAlert.length > 0 && (
        <AppText style={styles.descriptionAlert}>{descriptionAlert}</AppText>
      )}
      {translatedDescription.length > 0 && (
        <AppText style={styles.description}>{translatedDescription}</AppText>
      )}
      {maxQuantity === 1 && (
        <AppText style={sharedStyles.maxQuantityLabel}>
          <ItemMaxUnitLabel
            unit={
              unit && {
                ...unit,
                ...{ label: c13n[unit.label] ?? unit.label }
              }
            }
            maxQuantity={maxQuantity}
          />
        </AppText>
      )}
    </View>
  );
};
