import React, { FunctionComponent } from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "../../Layout/AppText";
import { CampaignPolicy } from "../../../types";
import { ItemMaxUnitLabel } from "./ItemMaxUnitLabel";
import { fontSize, color } from "../../../common/styles";
import { sharedStyles } from "./sharedStyles";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";

const styles = StyleSheet.create({
  name: {
    fontSize: fontSize(1),
    fontFamily: "brand-bold",
  },
  description: {
    fontSize: fontSize(0),
  },
  descriptionAlert: {
    fontFamily: "brand-italic",
    color: color("red", 50),
  },
});

export const ItemContent: FunctionComponent<{
  name: CampaignPolicy["name"];
  description: CampaignPolicy["description"];
  unit: CampaignPolicy["quantity"]["unit"];
  maxQuantity: number;
  accessibilityLabel?: string;
}> = ({
  name,
  description,
  unit,
  maxQuantity,
  accessibilityLabel = "item-content",
}) => {
  const { c13nt } = useTranslate();
  const tDescription = c13nt(description ?? "");

  return (
    <View>
      <AppText
        style={styles.name}
        accessibilityLabel={`${accessibilityLabel}-name`}
        testID={`${accessibilityLabel}-name`}
        accessible={true}
      >
        {c13nt(name)}
      </AppText>
      {tDescription.length > 0 && (
        <AppText style={styles.description}>{tDescription}</AppText>
      )}
      {maxQuantity > 0 && (
        <AppText style={sharedStyles.maxQuantityLabel}>
          <ItemMaxUnitLabel unit={unit} maxQuantity={maxQuantity} />
        </AppText>
      )}
    </View>
  );
};
