import React, { FunctionComponent, memo } from "react";
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
  descriptionAlert?: string;
  unit: CampaignPolicy["quantity"]["unit"];
  maxQuantity: number;
  accessibilityLabel?: string;
  // eslint-disable-next-line react/display-name
}> = memo(
  ({
    name,
    description,
    descriptionAlert,
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
        {descriptionAlert && descriptionAlert.length > 0 && (
          <AppText style={styles.descriptionAlert}>{descriptionAlert}</AppText>
        )}
        {tDescription.length > 0 && (
          <AppText style={styles.description}>{tDescription}</AppText>
        )}
        {maxQuantity === 1 && (
          <AppText style={sharedStyles.maxQuantityLabel}>
            <ItemMaxUnitLabel unit={unit} maxQuantity={maxQuantity} />
          </AppText>
        )}
      </View>
    );
  }
);
