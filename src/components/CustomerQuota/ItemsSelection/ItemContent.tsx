import React, { FunctionComponent, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "../../Layout/AppText";
import { CampaignPolicy } from "../../../types";
import { ItemMaxUnitLabel } from "./ItemMaxUnitLabel";
import { fontSize, color } from "../../../common/styles";
import { sharedStyles } from "./sharedStyles";
import { CampaignConfigContext } from "../../../context/campaignConfig";
import {
  extractTranslationFromC13N,
  extractUnitTranslationFromC13N
} from "../../../utils/translation";

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

  const translatedName = extractTranslationFromC13N(c13n, name);
  const translatedDescription = extractTranslationFromC13N(c13n, description);
  const unitWithTranslatedLabel = extractUnitTranslationFromC13N(c13n, unit);

  return (
    <View>
      <AppText style={styles.name}>{translatedName}</AppText>
      {descriptionAlert && descriptionAlert.length > 0 && (
        <AppText style={styles.descriptionAlert}>{descriptionAlert}</AppText>
      )}
      {!!translatedDescription && (
        <AppText style={styles.description}>{translatedDescription}</AppText>
      )}
      {maxQuantity === 1 && (
        <AppText style={sharedStyles.maxQuantityLabel}>
          <ItemMaxUnitLabel
            unit={unitWithTranslatedLabel}
            maxQuantity={maxQuantity}
          />
        </AppText>
      )}
    </View>
  );
};
