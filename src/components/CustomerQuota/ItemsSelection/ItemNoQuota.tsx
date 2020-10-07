import React, { FunctionComponent, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "../../Layout/AppText";
import { size, color, fontSize, borderRadius } from "../../../common/styles";
import { ItemContent } from "./ItemContent";
import { CartItem } from "../../../hooks/useCart/useCart";
import { ProductContext } from "../../../context/products";
import { sharedStyles } from "./sharedStyles";
import { i18nString } from "../../../utils/i18nString";

const styles = StyleSheet.create({
  feedbackWrapper: {
    height: size(6),
    backgroundColor: color("yellow", 10),
    borderWidth: 1,
    borderColor: color("yellow", 20),
    borderRadius: borderRadius(3),
    paddingHorizontal: size(1.5),
    justifyContent: "center"
  },
  feedbackText: {
    textAlign: "center",
    textAlignVertical: "center",
    color: color("yellow", 50),
    fontSize: fontSize(-2),
    fontFamily: "brand-bold"
  }
});

export const ItemNoQuota: FunctionComponent<{
  cartItem: CartItem;
}> = ({ cartItem }) => {
  const { category, maxQuantity } = cartItem;
  const { getProduct } = useContext(ProductContext);
  const { name = category, description, quantity, type } =
    getProduct(category) || {};

  return (
    <View style={[sharedStyles.wrapper, sharedStyles.wrapperDefault]}>
      <View style={sharedStyles.contentWrapper}>
        <ItemContent
          name={name}
          description={description}
          unit={quantity?.unit}
          maxQuantity={maxQuantity}
        />
      </View>
      <View style={styles.feedbackWrapper}>
        <AppText style={styles.feedbackText}>
          {type === "REDEEM"
            ? i18nString("notEligibleScreen", "notEligible")
            : `${i18nString("notEligibleScreen", "cannot")}
              \n
              ${i18nString("notEligibleScreen", "purchase")}`}
        </AppText>
      </View>
    </View>
  );
};
