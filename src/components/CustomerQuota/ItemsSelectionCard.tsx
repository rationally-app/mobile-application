import React, { FunctionComponent, ReactElement, useState } from "react";
import { useProductContext } from "../../context/products";
import { View, StyleSheet, Alert } from "react-native";
import { CustomerCard } from "./CustomerCard";
import { AppText } from "../Layout/AppText";
import { borderRadius, size, color, fontSize } from "../../common/styles";
import { sharedStyles } from "./sharedStyles";
import { Checkbox } from "../Layout/Checkbox";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import { Feather } from "@expo/vector-icons";
import { Cart, CartHook } from "../../hooks/useCart/useCart";
import { AddUserModal } from "./AddUserModal";

const styles = StyleSheet.create({
  noQuotaCategoryItemWrapper: {
    flexDirection: "row",
    borderRadius: borderRadius(3),
    alignItems: "center",
    minHeight: size(9),
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: color("grey", 20)
  },
  labelWrapper: {
    marginLeft: size(2.5),
    flex: 1
  },
  noQuotaCategoryItemFeedback: {
    height: size(6),
    backgroundColor: color("yellow", 10),
    borderWidth: 1,
    borderColor: color("yellow", 20),
    borderRadius: borderRadius(3),
    paddingHorizontal: size(1.5),
    marginRight: size(2),
    justifyContent: "center"
  },
  noQuotaCategoryItemFeedbackText: {
    textAlign: "center",
    textAlignVertical: "center",
    color: color("yellow", 50),
    fontSize: fontSize(-2),
    fontFamily: "brand-bold"
  },
  checkboxesListItem: {
    marginBottom: size(1.5)
  },
  categoryText: {
    fontSize: fontSize(2)
  }
});

const NoQuotaCategoryItem: FunctionComponent<{ label: ReactElement }> = ({
  label
}) => (
  <View style={styles.noQuotaCategoryItemWrapper}>
    <View style={styles.labelWrapper}>{label}</View>
    <View style={styles.noQuotaCategoryItemFeedback}>
      <AppText style={styles.noQuotaCategoryItemFeedbackText}>
        Cannot{"\n"}purchase
      </AppText>
    </View>
  </View>
);

interface ItemsSelectionCard {
  nrics: string[];
  addNric: (nric: string) => void;
  isLoading: boolean;
  checkoutCart: () => void;
  onCancel: () => void;
  cart: Cart;
  updateCart: CartHook["updateCart"];
}

export const ItemsSelectionCard: FunctionComponent<ItemsSelectionCard> = ({
  nrics,
  addNric,
  isLoading,
  checkoutCart,
  onCancel,
  cart,
  updateCart
}) => {
  const { getProduct } = useProductContext();
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  return (
    <View>
      <CustomerCard
        nrics={nrics}
        onAddNric={() => setIsAddUserModalVisible(true)}
      >
        <View style={sharedStyles.resultWrapper}>
          {cart.map(({ category, quantity, maxQuantity }) => {
            const product = getProduct(category);
            const categoryText = product?.name || category;
            return maxQuantity === 0 ? (
              <View style={styles.checkboxesListItem} key={category}>
                <NoQuotaCategoryItem
                  label={
                    <AppText style={styles.categoryText}>
                      {categoryText}
                    </AppText>
                  }
                />
              </View>
            ) : (
              <View style={styles.checkboxesListItem} key={category}>
                <Checkbox
                  label={
                    <AppText style={styles.categoryText}>
                      {categoryText}
                    </AppText>
                  }
                  isChecked={quantity > 0}
                  onToggle={() =>
                    updateCart(category, quantity > 0 ? 0 : maxQuantity)
                  }
                />
              </View>
            );
          })}
        </View>
      </CustomerCard>
      <View style={[sharedStyles.ctaButtonsWrapper, sharedStyles.buttonRow]}>
        <View
          style={[
            sharedStyles.submitButton,
            !isLoading && { marginRight: size(2) }
          ]}
        >
          <DarkButton
            text="Checkout"
            icon={
              <Feather
                name="shopping-cart"
                size={size(2)}
                color={color("grey", 0)}
              />
            }
            onPress={checkoutCart}
            isLoading={isLoading}
            fullWidth={true}
          />
        </View>
        {!isLoading && (
          <SecondaryButton
            text="Cancel"
            onPress={() => {
              Alert.alert("Cancel transaction?", undefined, [
                {
                  text: "No"
                },
                {
                  text: "Yes",
                  onPress: onCancel,
                  style: "destructive"
                }
              ]);
            }}
          />
        )}
      </View>
      <AddUserModal
        isVisible={isAddUserModalVisible}
        setIsVisible={setIsAddUserModalVisible}
        nrics={nrics}
        addNric={addNric}
      />
    </View>
  );
};
