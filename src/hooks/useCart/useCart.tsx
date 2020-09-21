import { useState, useCallback, useContext, useEffect } from "react";
import { postTransaction } from "../../services/quota";
import { ProductContextValue, ProductContext } from "../../context/products";
import { PostTransactionResult, ItemQuota, IdentifierInput } from "../../types";
import { validateIdentifierInputs } from "../../utils/validateIdentifierInputs";
import { ERROR_MESSAGE } from "../../context/alert";
import { SessionError } from "../../services/helpers";

export type CartItem = {
  category: string;
  quantity: number;
  maxQuantity: number;
  descriptionAlert?: string;
  /**
   * Indicates the previous time quota was used.
   * It will be undefined for batch quotas.
   */
  lastTransactionTime?: Date;
  identifierInputs: IdentifierInput[];
};

export type Cart = CartItem[];

type CartState = "DEFAULT" | "CHECKING_OUT" | "PURCHASED";

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
  checkoutResult?: PostTransactionResult;
  error?: Error;
  clearError: () => void;
};

const getItem = (
  cart: Cart,
  category: string
): [CartItem | undefined, number] => {
  const idx = cart.findIndex(item => item.category === category);
  return [cart[idx], idx];
};

const mergeWithCart = (
  cart: Cart,
  quota: ItemQuota[],
  getProduct: ProductContextValue["getProduct"]
): Cart => {
  return quota
    .sort((itemOne, itemTwo) => {
      const productOneOrder = getProduct(itemOne.category)?.order || 0;
      const productTwoOrder = getProduct(itemTwo.category)?.order || 0;

      return productOneOrder - productTwoOrder;
    })
    .map(
      ({
        category,
        quantity: remainingQuantity,
        transactionTime,
        identifierInputs
      }) => {
        remainingQuantity = Math.max(remainingQuantity, 0);
        const [existingItem] = getItem(cart, category);

        const product = getProduct(category);
        const defaultQuantity = product?.quantity.default || 0;
        const defaultIdentifierInputs =
          product?.identifiers?.map(
            ({ label, textInput, scanButton, validationRegex }) => ({
              label: label,
              value: "",
              ...(textInput.type ? { textInputType: textInput.type } : {}),
              ...(scanButton.type ? { scanButtonType: scanButton.type } : {}),
              ...(validationRegex ? { validationRegex } : {})
            })
          ) || [];

        let descriptionAlert: string | undefined = undefined;
        if (product && product.alert) {
          const expandedQuota = product.quantity.limit - remainingQuantity;
          descriptionAlert =
            expandedQuota >= product.alert.threshold
              ? product.alert.label
              : undefined;
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
          identifierInputs: identifierInputs || defaultIdentifierInputs
        };
      }
    );
};

export const useCart = (
  ids: string[],
  authKey: string,
  endpoint: string,
  remainingQuota?: ItemQuota[]
): CartHook => {
  const { products, getProduct } = useContext(ProductContext);
  const [cart, setCart] = useState<Cart>([]);
  const [cartState, setCartState] = useState<CartState>("DEFAULT");
  const [checkoutResult, setCheckoutResult] = useState<PostTransactionResult>();
  const [error, setError] = useState<Error>();
  const clearError = useCallback((): void => setError(undefined), []);

  /**
   * Merge quota response with current cart whenever remaining quota change or product change.
   */

  useEffect(() => {
    if (remainingQuota) {
      setCart(cart => mergeWithCart(cart, remainingQuota, getProduct));
    }
  }, [remainingQuota, products, getProduct]);

  const emptyCart: CartHook["emptyCart"] = useCallback(() => {
    setCart([]);
  }, []);

  /**
   * Update quantity of an item in the cart.
   */
  const updateCart: CartHook["updateCart"] = useCallback(
    (category, quantity, identifierInputs) => {
      if (quantity < 0) {
        setError(new Error(ERROR_MESSAGE.INVALID_QUANTITY));
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
                identifierInputs || cart[itemIdx].identifierInputs
            },
            ...cart.slice(itemIdx + 1)
          ]);
        } else {
          setError(new Error(ERROR_MESSAGE.INSUFFICIENT_QUOTA));
          return;
        }
      } else {
        setError(new Error(ERROR_MESSAGE.INVALID_CATEGORY));
        return;
      }
    },
    [cart]
  );

  /**
   * Handles the checking out of the cart.
   * Sets checkoutResult to the response of the post transaction.
   */
  const checkoutCart: CartHook["checkoutCart"] = useCallback(() => {
    const checkout = async (): Promise<void> => {
      setCartState("CHECKING_OUT");

      const allIdentifierInputs: IdentifierInput[] = [];
      const transactions = Object.values(cart)
        .filter(({ quantity }) => quantity)
        .map(({ category, quantity, identifierInputs }) => {
          if (
            identifierInputs.length > 0 &&
            identifierInputs.some(identifierInput => !identifierInput.value)
          ) {
          }
          allIdentifierInputs.push(...identifierInputs);
          return { category, quantity, identifierInputs };
        });

      if (transactions.length === 0) {
        setCartState("DEFAULT");
        setError(new Error(ERROR_MESSAGE.MISSING_SELECTION));
        return;
      }

      try {
        validateIdentifierInputs(allIdentifierInputs);
      } catch (error) {
        setCartState("DEFAULT");
        setError(error);
        return;
      }

      try {
        const transactionResponse = await postTransaction({
          ids,
          key: authKey,
          transactions,
          endpoint
        });
        setCheckoutResult(transactionResponse);
        setCartState("PURCHASED");
      } catch (e) {
        setCartState("DEFAULT");
        if (
          e.message === "Invalid Purchase Request: Duplicate identifier inputs"
        ) {
          setError(new Error(ERROR_MESSAGE.DUPLICATE_IDENTIFIER_INPUT));
        } else if (e instanceof SessionError) {
          setError(e);
        } else {
          setError(new Error(ERROR_MESSAGE.SERVER_ERROR));
        }
      }
    };

    checkout();
  }, [authKey, cart, endpoint, ids]);

  return {
    cartState,
    cart,
    emptyCart,
    updateCart,
    checkoutCart,
    checkoutResult,
    error,
    clearError
  };
};
