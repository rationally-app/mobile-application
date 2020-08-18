import React, { FunctionComponent, useState, useContext } from "react";
import { Alert, View, Vibration } from "react-native";
import { CustomerCard } from "../CustomerCard";
import { size, color } from "../../../common/styles";
import { sharedStyles } from "../sharedStyles";
import { DarkButton } from "../../Layout/Buttons/DarkButton";
import { SecondaryButton } from "../../Layout/Buttons/SecondaryButton";
import { Feather } from "@expo/vector-icons";
import { Cart, CartHook } from "../../../hooks/useCart/useCart";
import { AddUserModal } from "../AddUserModal";
import { Item } from "./Item";
import { useProductContext } from "../../../context/products";
import {
  AlertModalContext,
  defaultWarningProps,
  wrongFormatAlertProps
} from "../../../context/alert";
import { validateAndCleanId } from "../../../utils/validateIdentification";
import { EnvVersionError } from "../../../services/envVersion";
import { Sentry } from "../../../utils/errorTracking";

interface ItemsSelectionCard {
  ids: string[];
  addId: (id: string) => void;
  isLoading: boolean;
  checkoutCart: () => void;
  onCancel: () => void;
  cart: Cart;
  updateCart: CartHook["updateCart"];
}

export const ItemsSelectionCard: FunctionComponent<ItemsSelectionCard> = ({
  ids,
  addId,
  isLoading,
  checkoutCart,
  onCancel,
  cart,
  updateCart
}) => {
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const { getFeatures, products } = useProductContext();
  const { showAlert } = useContext(AlertModalContext);

  const { features } = useProductContext();

  const onModalCheck = async (input: string): Promise<void> => {
    try {
      const id = validateAndCleanId(
        input,
        features?.id?.validation,
        features?.id?.validationRegex
      );
      Vibration.vibrate(50);
      setIsAddUserModalVisible(false);
      if (ids.indexOf(id) > -1) {
        throw new Error("Enter or scan a different ID number.");
      }
      addId(id);
    } catch (e) {
      if (e instanceof EnvVersionError) {
        Sentry.captureException(e);
        // todo: alert for env version errors
      }
      showAlert({
        ...wrongFormatAlertProps,
        description: e.message,
        onOk: () => setIsAddUserModalVisible(true)
      });
    }
  };

  // TODO:
  // We may need to refactor this card once the difference in behaviour between main products and appeal products is vastly different.
  // To be further discuss
  const isAppeal = products.some(product => product.categoryType === "APPEAL");
  return (
    <View>
      <CustomerCard
        ids={ids}
        onAddId={
          getFeatures()?.TRANSACTION_GROUPING
            ? () => setIsAddUserModalVisible(true)
            : undefined
        }
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
        {!isLoading && (
          <SecondaryButton
            text={isAppeal ? "Back" : "Cancel"}
            onPress={
              isAppeal
                ? onCancel
                : () => {
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
                  }
            }
          />
        )}
        <View
          style={[
            sharedStyles.submitButton,
            !isLoading && { marginLeft: size(2) }
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
      </View>
      <AddUserModal
        isVisible={isAddUserModalVisible}
        setIsVisible={setIsAddUserModalVisible}
        validateAndUpdateIds={onModalCheck}
      />
    </View>
  );
};
