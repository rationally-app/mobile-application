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
import { ProductContext } from "../../../context/products";
import {
  AlertModalContext,
  defaultWarningProps,
  defaultConfirmationProps,
  wrongFormatAlertProps,
  ERROR_MESSAGE,
  WARNING_MESSAGE,
  duplicateAlertProps
} from "../../../context/alert";
import { validateAndCleanId } from "../../../utils/validateIdentification";
import { CampaignConfigContext } from "../../../context/campaignConfig";

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
  const { features } = useContext(CampaignConfigContext);
  const { products } = useContext(ProductContext);
  const { showAlert } = useContext(AlertModalContext);

  const onCheckAddedUsers = async (input: string): Promise<void> => {
    try {
      if (!features) {
        return;
      }
      const id = validateAndCleanId(
        input,
        features.id.validation,
        features.id.validationRegex
      );
      Vibration.vibrate(50);
      if (ids.indexOf(id) > -1) {
        throw new Error(ERROR_MESSAGE.DUPLICATE_ID);
      }
      addId(id);
    } catch (e) {
      setIsAddUserModalVisible(false);
      if (e.message === ERROR_MESSAGE.DUPLICATE_ID) {
        showAlert({
          ...duplicateAlertProps,
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
  const isChargeable = cart.some(
    cartItem => cartItem.descriptionAlert === "*chargeable"
  );
  return (
    <View>
      <CustomerCard
        ids={ids}
        onAddId={
          features?.transactionGrouping
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
            onPress={
              !isChargeable
                ? checkoutCart
                : () => {
                    showAlert({
                      ...defaultConfirmationProps,
                      title: "Payment collected?",
                      description: WARNING_MESSAGE.PAYMENT_COLLECTION,
                      buttonTexts: {
                        primaryActionText: "Collected",
                        secondaryActionText: "No"
                      },
                      visible: true,
                      onOk: checkoutCart
                    });
                  }
            }
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
