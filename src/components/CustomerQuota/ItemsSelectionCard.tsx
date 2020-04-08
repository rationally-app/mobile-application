import React, {
  FunctionComponent,
  ReactElement,
  Dispatch,
  SetStateAction
} from "react";
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
import { CartState } from "./types";

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
    fontFamily: "inter-bold"
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
  nric: string;
  isLoading: boolean;
  onRecordTransaction: () => Promise<void>;
  onCancel: () => void;
  cart?: CartState;
  setCart: Dispatch<SetStateAction<CartState | undefined>>;
}

export const ItemsSelectionCard: FunctionComponent<ItemsSelectionCard> = ({
  nric,
  isLoading,
  onRecordTransaction,
  onCancel,
  cart,
  setCart
}) => {
  const { getProduct } = useProductContext();
  if (!cart) {
    return null;
  }
  return (
    <View>
      <CustomerCard nric={nric}>
        <View style={sharedStyles.resultWrapper}>
          {Object.entries(cart)
            .sort((itemOne, itemTwo) => {
              const productOneOrder = getProduct(itemOne[0])?.order || 0;
              const productTwoOrder = getProduct(itemTwo[0])?.order || 0;

              return productOneOrder - productTwoOrder;
            })
            .map(([category, canBuy]) => {
              const product = getProduct(category);
              const categoryText = product?.name || category;
              return canBuy === null ? (
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
                    isChecked={canBuy}
                    onToggle={() =>
                      setCart(cart => ({
                        ...cart,
                        [category]: !cart?.[category]
                      }))
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
            onPress={onRecordTransaction}
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
    </View>
  );
};
