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
// import { PaymentConfirmationModal } from "../PaymentConfirmationModal";
import { Item } from "./Item";
import { ProductContext } from "../../../context/products";
import {
  AlertModalContext,
  ERROR_MESSAGE,
  WARNING_MESSAGE,
} from "../../../context/alert";
import { validateAndCleanId } from "../../../utils/validateIdentification";
import { CampaignConfigContext } from "../../../context/campaignConfig";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";
import { PaymentConfirmationModal } from "../PaymentConfirmationModal";

interface ItemsSelectionCard {
  ids: string[];
  addId: (id: string) => void;
  isLoading: boolean;
  checkoutCart: CartHook["checkoutCart"];
  reserveCart: CartHook["reserveCart"];
  commitCart: CartHook["commitCart"];
  onCancel: () => void;
  onBack: () => void;
  cart: Cart;
  updateCart: CartHook["updateCart"];
  cancelCart: CartHook["cancelCart"];
}

export const ItemsSelectionCard: FunctionComponent<ItemsSelectionCard> = ({
  ids,
  addId,
  isLoading,
  checkoutCart,
  reserveCart,
  commitCart,
  cancelCart,
  onCancel,
  onBack,
  cart,
  updateCart,
}) => {
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const { features } = useContext(CampaignConfigContext);
  const { products } = useContext(ProductContext);
  const { showWarnAlert, showErrorAlert } = useContext(AlertModalContext);
  const [showPaymentAlert, setShowPaymentAlert] = useState<boolean>(false);

  const { i18nt } = useTranslate();

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
      showErrorAlert(e, () => setIsAddUserModalVisible(true));
    }
  };

  // TODO:
  // We may need to refactor this card once the difference in behaviour between main products and appeal products is vastly different.
  // To be further discuss
  const isAppeal = products.some(
    (product) => product.categoryType === "APPEAL"
  );
  const isChargeable = cart.some(
    (cartItem) => cartItem.descriptionAlert === "*chargeable"
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
          {cart.map((cartItem) => (
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
            text={
              isAppeal
                ? i18nt("customerQuotaScreen", "quotaScanButtonBack")
                : i18nt("customerQuotaScreen", "quotaAppealCancel")
            }
            onPress={
              isAppeal
                ? onBack
                : () => {
                    showWarnAlert(WARNING_MESSAGE.CANCEL_ENTRY, onCancel);
                  }
            }
          />
        )}
        <View
          style={[
            sharedStyles.submitButton,
            !isLoading && { marginLeft: size(2) },
          ]}
        >
          <DarkButton
            text={i18nt("customerQuotaScreen", "quotaButtonCheckout")}
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
                : async () => {
                    try {
                      await reserveCart();
                      setShowPaymentAlert(true);
                    } catch (e) {
                      setShowPaymentAlert(false);
                      showErrorAlert(e);
                    }
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
      <PaymentConfirmationModal
        isVisible={showPaymentAlert}
        commitCart={commitCart}
        cancelPayment={cancelCart}
      />
    </View>
  );
};
