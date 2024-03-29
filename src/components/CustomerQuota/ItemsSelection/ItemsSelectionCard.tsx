import React, {
  FunctionComponent,
  useEffect,
  useState,
  useContext,
} from "react";
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
  CONFIRMATION_MESSAGE,
  ERROR_MESSAGE,
  WARNING_MESSAGE,
} from "../../../context/alert";
import { validateAndCleanId } from "../../../utils/validateIdentification";
import { CampaignConfigContext } from "../../../context/campaignConfig";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";

interface ItemsSelectionCard {
  ids: string[];
  addId: (id: string) => void;
  isLoading: boolean;
  hasPendingConfirmation: boolean;
  checkoutCart: () => void;
  completeCheckout: () => void;
  resetCartState: () => void;
  onCancel: () => void;
  onBack: () => void;
  cart: Cart;
  updateCart: CartHook["updateCart"];
}

interface AddonToggleItem {
  hasAddonToggle: boolean;
  descriptionAlert: string;
}

export const ItemsSelectionCard: FunctionComponent<ItemsSelectionCard> = ({
  ids,
  addId,
  isLoading,
  hasPendingConfirmation,
  checkoutCart,
  completeCheckout,
  resetCartState,
  onCancel,
  onBack,
  cart,
  updateCart,
}) => {
  const [isAddUserModalVisible, setIsAddUserModalVisible] = useState(false);
  const { features } = useContext(CampaignConfigContext);
  const { products } = useContext(ProductContext);
  const { showWarnAlert, showConfirmationAlert, showErrorAlert } =
    useContext(AlertModalContext);

  useEffect(() => {
    if (!hasPendingConfirmation) {
      return;
    }
    showConfirmationAlert(
      CONFIRMATION_MESSAGE.PAYMENT_COLLECTION,
      completeCheckout,
      resetCartState
    );
  }, [
    hasPendingConfirmation,
    completeCheckout,
    resetCartState,
    showConfirmationAlert,
  ]);

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

  const addonToggleItem: AddonToggleItem = {
    hasAddonToggle: false,
    descriptionAlert: "",
  };
  cart.some((cartItem) => {
    if (
      cartItem.descriptionAlert === "*chargeable" ||
      cartItem.descriptionAlert === "*waive charges"
    ) {
      addonToggleItem.hasAddonToggle = true;
      addonToggleItem.descriptionAlert = cartItem.descriptionAlert;
      return true;
    }
    return false;
  });
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
              ids={ids}
              addonToggleItem={addonToggleItem.hasAddonToggle}
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
            onPress={checkoutCart}
            isLoading={isLoading}
            fullWidth={true}
            accessibilityLabel="items-selection-checkout-button"
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
