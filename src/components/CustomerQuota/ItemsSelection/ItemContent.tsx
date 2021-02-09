import React, { FunctionComponent } from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "../../Layout/AppText";
import { CampaignPolicy } from "../../../types";
import { ItemMaxUnitLabel } from "./ItemMaxUnitLabel";
import { fontSize } from "../../../common/styles";
import { sharedStyles } from "./sharedStyles";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";
import { ShowChargeableItemsToggle } from "./ShowChargeableItemsToggle";

const styles = StyleSheet.create({
  name: {
    fontSize: fontSize(1),
    fontFamily: "brand-bold",
  },
  description: {
    fontSize: fontSize(0),
  },
});

export const ItemContent: FunctionComponent<{
  name: CampaignPolicy["name"];
  description: CampaignPolicy["description"];
  descriptionAlert?: string;
  unit: CampaignPolicy["quantity"]["unit"];
  maxQuantity: number;
  accessibilityLabel?: string;
  showChargeableToggle: () => void;
  isShowChargeable: boolean;
}> = ({
  name,
  description,
  descriptionAlert,
  unit,
  maxQuantity,
  accessibilityLabel = "item-content",
  showChargeableToggle,
  isShowChargeable,
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
      {maxQuantity === 1 && (
        <AppText style={sharedStyles.maxQuantityLabel}>
          <ItemMaxUnitLabel unit={unit} maxQuantity={maxQuantity} />
        </AppText>
      )}
      {descriptionAlert && descriptionAlert.length > 0 && (
        <ShowChargeableItemsToggle
          descriptionAlert={descriptionAlert}
          toggleIsShowChargeableItems={showChargeableToggle}
          isShowChargeableItems={isShowChargeable}
        />
      )}
    </View>
  );
};
