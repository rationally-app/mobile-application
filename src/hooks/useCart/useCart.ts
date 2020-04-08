import { useState, useEffect, useCallback } from "react";
import {
  getQuota,
  Quota,
  postTransaction,
  PostTransactionResponse,
  QuotaItem,
  PostTransaction
} from "../../services/quota";

type CartItem = {
  category: string;
  quantity: number;
  maxQuantity: number;
};

export type Cart = {
  [category: string]: CartItem;
};

type CartState =
  | "FETCHING_QUOTA"
  | "NO_QUOTA"
  | "DEFAULT"
  | "CHECKING_OUT"
  | "PURCHASED";

export type CartHook = {
  cartState: CartState;
  cart: Cart;
  updateCart: (category: string, quantity: number) => void;
  checkoutCart: () => void;
  checkoutResult?: PostTransactionResponse;
  error?: Error;
  clearError: () => void;
};

const mergeWithCart = (cart: Cart, quota: QuotaItem[]): Cart => {
  return quota.reduce((newCart, item) => {
    newCart[item.category] = {
      category: item.category,
      quantity: Math.min(item.quantity, cart[item.category]?.quantity ?? 0),
      maxQuantity: item.quantity
    };
    return newCart;
  }, {} as Cart);
};

const hasNoQuota = (quota: Quota): boolean =>
  quota.remainingQuota.every(item => item.quantity === 0);

export const useCart = (
  ids: string[],
  authKey: string,
  endpoint: string
): CartHook => {
  const [cart, setCart] = useState<Cart>({});
  const [cartState, setCartState] = useState<CartState>("DEFAULT");
  const [checkoutResult, setCheckoutResult] = useState<
    PostTransactionResponse
  >();
  const [error, setError] = useState<Error>();

  const clearError = useCallback((): void => setError(undefined), []);

  /**
   * Fetch quota whenever IDs change.
   */
  useEffect(() => {
    const fetchQuota = async (): Promise<void> => {
      setCartState("FETCHING_QUOTA");
      try {
        const quotaResponse = await getQuota(ids, authKey, endpoint);
        if (hasNoQuota(quotaResponse)) {
          setCartState("NO_QUOTA");
        } else {
          setCartState("DEFAULT");
        }

        // Note that we must use a callback within this setState to avoid
        // having cart as a dependency which causes an infinite loop.
        setCart(cart => mergeWithCart(cart, quotaResponse.remainingQuota));
      } catch (e) {
        setError(e); // Cart will remain in FETCHING_QUOTA state.
      }
    };

    fetchQuota();
  }, [authKey, endpoint, ids]);

  /**
   * Update quantity of an item in the cart.
   */
  const updateCart: CartHook["updateCart"] = useCallback(
    (category, quantity) => {
      if (quantity < 0) {
        setError(new Error("Invalid quantity"));
        return;
      }
      if (cart.hasOwnProperty(category)) {
        if (quantity <= cart[category].maxQuantity) {
          setCart({
            ...cart,
            [category]: {
              ...cart[category],
              quantity
            }
          });
        } else {
          setError(new Error("Insufficient quota"));
          return;
        }
      } else {
        setError(new Error("Category does not exist"));
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
      const transactions = Object.values(cart)
        .filter(({ quantity }) => quantity)
        .reduce((transactions, { category, quantity }) => {
          transactions.push({
            category,
            quantity
          });
          return transactions;
        }, [] as PostTransaction["transactions"]);

      if (transactions.length === 0) {
        setError(new Error("Please select at least one item to checkout"));
        setCartState("DEFAULT");
        return;
      }

      try {
        const transactionResponse = await postTransaction({
          nrics: ids,
          key: authKey,
          transactions,
          endpoint
        });
        setCheckoutResult(transactionResponse);
        setCartState("PURCHASED");
      } catch (e) {
        setError(new Error("Couldn't checkout, please try again later"));
        setCartState("DEFAULT");
      }
    };

    checkout();
  }, [authKey, cart, endpoint, ids]);

  return {
    cartState,
    cart,
    updateCart,
    checkoutCart,
    checkoutResult,
    error,
    clearError
  };
};
