import React, { FunctionComponent, useState } from "react";
import { View, Alert } from "react-native";
import { CustomerCard } from "../CustomerCard";
import { size, color } from "../../../common/styles";
import { sharedStyles } from "../sharedStyles";
import { DarkButton } from "../../Layout/Buttons/DarkButton";
import { SecondaryButton } from "../../Layout/Buttons/SecondaryButton";
import { Feather } from "@expo/vector-icons";
import { Cart, CartHook } from "../../../hooks/useCart/useCart";
import { AddUserModal } from "../AddUserModal";
import { Item } from "./Item";

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
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  return (
    <View>
      <CustomerCard
        nrics={nrics}
        onAddNric={() => setIsAddUserModalVisible(true)} // TODO: need to remove for identifiers
      >
        <View style={sharedStyles.resultWrapper}>
          {cart.map(cartItem => (
            <Item
              key={cartItem.category}
              cartItem={cartItem}
              updateCart={updateCart}
            />
          ))}
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
