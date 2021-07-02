import { useState, useCallback, useContext, useEffect } from "react";
import { postTransaction } from "../../services/quota";
import { PostTransactionResult, ItemQuota, IdentifierInput } from "../../types";
import { validateIdentifierInputs } from "../../utils/validateIdentifierInputs";
import { ERROR_MESSAGE } from "../../context/alert";
import { SessionError } from "../../services/helpers";
import { IdentificationContext } from "../../context/identification";
import { ProductContext, ProductContextValue } from "../../context/products";
import { usePrevious } from "../usePrevious";
import { hasInvalidRemainingQuota } from "../useQuota/useQuota";
import { DescriptionAlertTypes } from "../../components/CustomerQuota/ItemsSelection/ShowAddonsToggle";
import { CampaignConfigContext } from "../../context/campaignConfig";

export type CartItem = {
  category: string;
  quantity: number;
  maxQuantity: number;
  descriptionAlert?: DescriptionAlertTypes;
  /**
   * Indicates the previous time quota was used.
   * It will be undefined for batch quotas.
   */
  lastTransactionTime?: Date;
  identifierInputs: IdentifierInput[];
};

export type Cart = CartItem[];

type CartState =
  | "DEFAULT"
  | "CHECKING_OUT"
  | "PURCHASED"
  | "PENDING_CONFIRMATION"
  | "UNSUCCESSFUL";

export type CartHook = {
  cartState: CartState;
  cart: Cart;
  emptyCart: () => void;
  updateCart: (
    category: string,
    quantity: number,
    identifierInputs?: IdentifierInput[]
  ) => void;
  checkoutCart: () => void;
  completeCheckout: () => void;
  checkoutResult?: PostTransactionResult;
  cartError?: Error;
  clearCartError: () => void;
  resetCartState: () => void;
};

const getItem = (
  cart: Cart,
  category: string
): [CartItem | undefined, number] => {
  const idx = cart.findIndex((item) => item.category === category);
  return [cart[idx], idx];
};

const mergeWithCart = (
  cart: Cart,
  quota: ItemQuota[],
  getProduct: ProductContextValue["getProduct"]
): Cart => {
  quota.sort((itemOne, itemTwo) => {
    const productOneOrder = getProduct(itemOne.category)?.order || 0;
    const productTwoOrder = getProduct(itemTwo.category)?.order || 0;

    return productOneOrder - productTwoOrder;
  });

  return quota.map(
    ({ category, quantity: remainingQuantity, transactionTime }) => {
      remainingQuantity = Math.max(remainingQuantity, 0);
      const [existingItem] = getItem(cart, category);

      const product = getProduct(category);
      const defaultQuantity = product?.quantity.default || 0;
      const identifierInputs =
        product?.identifiers?.map(
          ({ label, textInput, scanButton, validationRegex }) => ({
            label: label,
            value: "",
            ...(textInput.type ? { textInputType: textInput.type } : {}),
            ...(scanButton.type ? { scanButtonType: scanButton.type } : {}),
            ...(validationRegex ? { validationRegex } : {}),
          })
        ) || [];

      let descriptionAlert: DescriptionAlertTypes | undefined = undefined;
      if (product && product.alert) {
        if (typeof product.alert.threshold === "number") {
          const expandedQuota = product.quantity.limit - remainingQuantity;
          descriptionAlert =
            expandedQuota >= product.alert.threshold
              ? (product.alert.label as DescriptionAlertTypes)
              : undefined;
        } else {
          /**
           * Since the reason item of policies with dependencies only shows up when
           * its dependent policy has reached its threshold, this section is only
           * called when the reason item becomes visible,
           * i.e., the dependent policy has reached its threshold.
           */
          descriptionAlert = product.alert.label as DescriptionAlertTypes;
        }
      }

      const checkoutLimit = product?.quantity.checkoutLimit;
      const maxQuantity = checkoutLimit
        ? Math.min(remainingQuantity, checkoutLimit)
        : remainingQuantity;

      return {
        category,
        quantity: Math.min(
          maxQuantity,
          existingItem?.quantity || defaultQuantity
        ),
        maxQuantity,
        descriptionAlert,
        lastTransactionTime: transactionTime,
        identifierInputs,
      };
    }
  );
};

export const useCart = (
  ids: string[],
  authKey: string,
  endpoint: string,
  cartQuota?: ItemQuota[]
): CartHook => {
  const { selectedIdType } = useContext(IdentificationContext);
  const [cart, setCart] = useState<Cart>([]);
  const [cartState, setCartState] = useState<CartState>("DEFAULT");
  const [checkoutResult, setCheckoutResult] = useState<PostTransactionResult>();
  const [cartError, setCartError] = useState<Error>();
  const clearCartError = useCallback((): void => setCartError(undefined), []);
  const resetCartState = useCallback((): void => setCartState("DEFAULT"), []);
  const { products, getProduct } = useContext(ProductContext);
  const prevProducts = usePrevious(products);
  const prevIds = usePrevious(ids);
  const prevCartQuota = usePrevious(cartQuota);
  const { features } = useContext(CampaignConfigContext);
  /**
   * Update the cart when:
   *  1. An incoming cart quota exists, AND
   *  2. There is no existing cart quota, OR
   *  3. The incoming cart quota is different from the existing cart quota, OR
   *  4. The customer IDs have changed, OR
   *  5. The products in the cart have changed
   */
  useEffect(() => {
    if (
      cartQuota &&
      (!prevCartQuota ||
        prevCartQuota != cartQuota ||
        prevIds !== ids ||
        prevProducts !== products)
    ) {
      if (!hasInvalidRemainingQuota(cartQuota)) {
        /**
         * Caveat: We must use a callback within this setState to avoid
         * having `cart` as a dependency, preventing an infinite loop.
         */
        setCart((cart) => mergeWithCart(cart, cartQuota, getProduct));
      } else if (features?.apiVersion === "v2") {
        /**
         * This is a special case for disbursements, where a beneficiary might be
         * whitelisted, but not disbursed with any items, resulting in an empty quota.
         * In this case, we will proceed to the NoQuotaCard, and an error dialog
         * will be shown subsequently. For non-v2 distributions, an empty quota
         * will still throw the invalid quantity error, seen below.
         */
        setCartError(new Error(ERROR_MESSAGE.MISSING_DISBURSEMENTS));
      } else {
        setCartError(new Error(ERROR_MESSAGE.INVALID_QUANTITY));
      }
    }
  }, [
    cartQuota,
    getProduct,
    prevCartQuota,
    ids,
    prevIds,
    products,
    prevProducts,
    features,
  ]);

  const emptyCart: CartHook["emptyCart"] = useCallback(() => {
    setCart([]);
  }, []);

  /**
   * Update quantity of an item in the cart.
   */
  const updateCart: CartHook["updateCart"] = useCallback(
    (category, quantity, identifierInputs) => {
      if (quantity < 0) {
        setCartError(new Error(ERROR_MESSAGE.INVALID_QUANTITY));
        return;
      }
      const [item, itemIdx] = getItem(cart, category);
      if (item) {
        if (quantity <= item.maxQuantity) {
          setCart([
            ...cart.slice(0, itemIdx),
            {
              ...item,
              quantity,
              identifierInputs:
                identifierInputs || cart[itemIdx].identifierInputs,
            },
            ...cart.slice(itemIdx + 1),
          ]);
        } else {
          setCartError(new Error(ERROR_MESSAGE.INSUFFICIENT_QUOTA));
          return;
        }
      } else {
        setCartError(new Error(ERROR_MESSAGE.INVALID_CATEGORY));
        return;
      }
    },
    [cart]
  );

  /**
   * Sets checkoutResult to the response of the post transaction.
   */
  const completeCheckout: CartHook["completeCheckout"] = useCallback(() => {
    const complete = async (): Promise<void> => {
      const transactions = Object.values(cart)
        .filter(({ quantity }) => quantity)
        .map(({ category, quantity, identifierInputs }) => {
          return { category, quantity, identifierInputs };
        });
      try {
        const transactionResponse = await postTransaction({
          ids,
          identificationFlag: selectedIdType,
          key: authKey,
          transactions,
          endpoint,
          apiVersion: features?.apiVersion,
        });
        setCheckoutResult(transactionResponse);
        setCartState("PURCHASED");
      } catch (e) {
        setCartState("DEFAULT");
        if (
          e.message === "Invalid Purchase Request: Duplicate identifier inputs"
        ) {
          setCartError(new Error(ERROR_MESSAGE.DUPLICATE_IDENTIFIER_INPUT));
        } else if (e.message === "Invalid Purchase Request: Item not found") {
          setCartError(new Error(ERROR_MESSAGE.INVALID_POD_IDENTIFIER));
        } else if (e.message === "No registered token found for customer") {
          setCartState("UNSUCCESSFUL");
        } else if (
          e.message ===
          "Token does not match the customer's last registered token"
        ) {
          setCartState("UNSUCCESSFUL");
        } else if (
          e.message === "Invalid Purchase Request: Item already used"
        ) {
          setCartError(new Error(ERROR_MESSAGE.ALREADY_USED_POD_IDENTIFIER));
        } else if (e instanceof SessionError) {
          setCartError(e);
        } else {
          setCartError(new Error(ERROR_MESSAGE.SERVER_ERROR));
        }
      }
    };
    complete();
  }, [cart, ids, selectedIdType, authKey, endpoint, features?.apiVersion]);

  /**
   * Handles the checking out of the cart.
   */
  const checkoutCart: CartHook["checkoutCart"] = useCallback(() => {
    const checkout = async (): Promise<void> => {
      setCartState("CHECKING_OUT");

      const allIdentifierInputs: IdentifierInput[] = [];
      const transactions = Object.values(cart)
        .filter(({ quantity }) => quantity)
        .map(({ category, quantity, identifierInputs }) => {
          allIdentifierInputs.push(...identifierInputs);
          return { category, quantity, identifierInputs };
        });

      if (transactions.length === 0) {
        setCartState("DEFAULT");
        setCartError(new Error(ERROR_MESSAGE.MISSING_SELECTION));
        return;
      }

      try {
        validateIdentifierInputs(allIdentifierInputs);
      } catch (error) {
        setCartState("DEFAULT");
        setCartError(error);
        return;
      }
      const hasPaymentReceipt = allIdentifierInputs.find(
        (identifierInput) => identifierInput.textInputType === "PAYMENT_RECEIPT"
      );
      if (hasPaymentReceipt) {
        setCartState("PENDING_CONFIRMATION");
        return;
      }

      completeCheckout();
    };

    checkout();
  }, [cart, completeCheckout]);

  return {
    cartState,
    cart,
    emptyCart,
    updateCart,
    checkoutCart,
    completeCheckout,
    checkoutResult,
    cartError,
    clearCartError,
    resetCartState,
  };
};
