import { useState, useEffect, useCallback } from "react";
import {
  getQuota,
  Quota,
  postTransaction,
  PostTransactionResponse,
  QuotaItem,
  PostTransaction
} from "../../services/quota";
import { useProductContext, ProductContextValue } from "../../context/products";
import { getPolicies } from "../../services/policies";
import { usePrevious } from "../usePrevious";

export type CartItem = {
  category: string;
  quantity: number;
  maxQuantity: number;
  /**
   * Indicates the previous time quota was used.
   * It will be undefined for batch quotas.
   */
  lastTransactionTime?: Date;
};

export type Cart = CartItem[];

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

const getItem = (
  cart: Cart,
  category: string
): [CartItem | undefined, number] => {
  const idx = cart.findIndex(item => item.category === category);
  return [cart[idx], idx];
};

const mergeWithCart = (
  cart: Cart,
  quota: QuotaItem[],
  getProduct: ProductContextValue["getProduct"]
): Cart => {
  return quota
    .sort((itemOne, itemTwo) => {
      const productOneOrder = getProduct(itemOne.category)?.order || 0;
      const productTwoOrder = getProduct(itemTwo.category)?.order || 0;

      return productOneOrder - productTwoOrder;
    })
    .map(({ category, quantity: maxQuantity, transactionTime }) => {
      const [existingItem] = getItem(cart, category);
      const defaultQuantity = getProduct(category)?.quantity.default || 0;
      return {
        category,
        quantity: Math.min(
          maxQuantity,
          existingItem?.quantity || defaultQuantity
        ),
        maxQuantity,
        lastTransactionTime: transactionTime
          ? new Date(transactionTime)
          : undefined
      };
    });
};

const hasNoQuota = (quota: Quota): boolean =>
  quota.remainingQuota.every(item => item.quantity === 0);

export const useCart = (
  ids: string[],
  authKey: string,
  endpoint: string
): CartHook => {
  const prevIds = usePrevious(ids);
  const { products, getProduct, setProducts } = useProductContext();
  const [cart, setCart] = useState<Cart>([]);
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
        if (products.length === 0) {
          const response = await getPolicies(authKey, endpoint);
          setProducts(response.policies);
        }
        const quotaResponse = await getQuota(ids, authKey, endpoint);
        if (hasNoQuota(quotaResponse)) {
          setCartState("NO_QUOTA");
        } else {
          setCartState("DEFAULT");
        }

        // Note that we must use a callback within this setState to avoid
        // having cart as a dependency which causes an infinite loop.
        setCart(cart =>
          mergeWithCart(cart, quotaResponse.remainingQuota, getProduct)
        );
      } catch (e) {
        setError(e); // Cart will remain in FETCHING_QUOTA state.
      }
    };

    if (prevIds !== ids) {
      fetchQuota();
    }
  }, [
    authKey,
    endpoint,
    getProduct,
    ids,
    prevIds,
    products.length,
    setProducts
  ]);

  /**
   * Update quantity of an item in the cart.
   */
  const updateCart: CartHook["updateCart"] = useCallback(
    (category, quantity) => {
      if (quantity < 0) {
        setError(new Error("Invalid quantity"));
        return;
      }
      const [item, itemIdx] = getItem(cart, category);
      if (item) {
        if (quantity <= item.maxQuantity) {
          setCart([
            ...cart.slice(0, itemIdx),
            {
              ...item,
              quantity
            },
            ...cart.slice(itemIdx + 1)
          ]);
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
