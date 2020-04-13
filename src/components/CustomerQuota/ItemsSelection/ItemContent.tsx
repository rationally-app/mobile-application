import React, { FunctionComponent } from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "../../Layout/AppText";
import { Policy } from "../../../types";
import { ItemMaxUnitLabel } from "./ItemMaxUnitLabel";
import { fontSize } from "../../../common/styles";
import { sharedStyles } from "./sharedStyles";

const styles = StyleSheet.create({
  name: {
    fontSize: fontSize(1),
    fontFamily: "brand-bold"
  },
  description: {
    fontSize: fontSize(0)
  }
});

export const ItemContent: FunctionComponent<{
  name: Policy["name"];
  description: Policy["description"];
  unit: Policy["quantity"]["unit"];
  maxQuantity: number;
}> = ({ name, description, unit, maxQuantity }) => (
  <View>
    <AppText style={styles.name}>{name}</AppText>
    {description && <AppText style={styles.description}>{description}</AppText>}
    {maxQuantity === 1 && (
      <AppText style={sharedStyles.maxQuantityLabel}>
        <ItemMaxUnitLabel unit={unit} maxQuantity={maxQuantity} />
      </AppText>
    )}
  </View>
);
