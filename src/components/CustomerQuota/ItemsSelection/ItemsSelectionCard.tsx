import React, { FunctionComponent, useState, useContext } from "react";
import { View, Vibration } from "react-native";
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
  wrongFormatAlertProps,
  systemAlertProps,
  ERROR_MESSAGE,
  defaultConfirmationProps,
  CONFIRMATION_MESSAGE
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
  onBack: () => void;
  cart: Cart;
  updateCart: CartHook["updateCart"];
}

export const ItemsSelectionCard: FunctionComponent<ItemsSelectionCard> = ({
  ids,
  addId,
  isLoading,
  checkoutCart,
  onCancel,
  onBack,
  cart,
  updateCart
}) => {
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const { getFeatures, products, features } = useProductContext();
  const { showAlert } = useContext(AlertModalContext);

  const onCheckAddedUsers = async (input: string): Promise<void> => {
    try {
      const id = validateAndCleanId(
        input,
        features?.id?.validation,
        features?.id?.validationRegex
      );
      Vibration.vibrate(50);
      setIsAddUserModalVisible(false);
      if (ids.indexOf(id) > -1) {
        throw new Error(ERROR_MESSAGE.DUPLICATE_ID);
      }
      addId(id);
    } catch (e) {
      if (e instanceof EnvVersionError) {
        Sentry.captureException(e);
        showAlert({
          ...systemAlertProps,
          description: e.message,
          onOk: () => setIsAddUserModalVisible(true)
        });
      } else {
        showAlert({
          ...wrongFormatAlertProps,
          description: e.message,
          onOk: () => setIsAddUserModalVisible(true)
        });
      }
    }
  };

  // TODO:
  // We may need to refactor this card once the difference in behaviour between main products and appeal products is vastly different.
  // To be further discuss
  const isAppeal = products.some(product => product.categoryType === "APPEAL");
  const handleCheckout = (): void => {
    cart.find(item => item.descriptionAlert === "*chargeable")
      ? showAlert({
          ...defaultConfirmationProps,
          title: "Payment collected?",
          description: CONFIRMATION_MESSAGE.PAYMENT_COLLECTED,
          buttonTexts: {
            primaryActionText: "Collected",
            secondaryActionText: "No"
          },
          visible: true,
          onOk: checkoutCart
        })
      : checkoutCart();
  };

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
                ? onBack
                : () => {
                    showAlert({
                      ...defaultWarningProps,
                      title: "Cancel entry and scan another ID number?",
                      buttonTexts: {
                        primaryActionText: "Cancel entry",
                        secondaryActionText: "Keep"
                      },
                      visible: true,
                      onOk: onCancel
                    });
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
            onPress={handleCheckout}
            isLoading={isLoading}
            fullWidth={true}
          />
        </View>
      </View>
      <AddUserModal
        isVisible={isAddUserModalVisible}
        setIsVisible={setIsAddUserModalVisible}
        validateAndUpdateIds={onCheckAddedUsers}
      />
    </View>
  );
};
