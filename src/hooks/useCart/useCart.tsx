import { useState, useEffect, useCallback } from "react";
import { getQuota, postTransaction, QuotaError } from "../../services/quota";
import { useProductContext, ProductContextValue } from "../../context/products";
import { getPolicies, PolicyError } from "../../services/policies";
import { usePrevious } from "../usePrevious";
import {
  PostTransactionResult,
  Quota,
  ItemQuota,
  PolicyIdentifierInput
} from "../../types";

export type CartItem = {
  category: string;
  quantity: number;
  maxQuantity: number;
  /**
   * Indicates the previous time quota was used.
   * It will be undefined for batch quotas.
   */
  lastTransactionTime?: Date;
  identifiers: PolicyIdentifierInput[];
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
  updateCart: (
    category: string,
    quantity: number,
    identifiers: PolicyIdentifierInput[]
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
    .map(({ category, quantity: maxQuantity, transactionTime }) => {
      const [existingItem] = getItem(cart, category);

      const product = getProduct(category);
      const defaultQuantity = product?.quantity.default || 0;

      return {
        category,
        quantity: Math.min(
          maxQuantity,
          existingItem?.quantity || defaultQuantity
        ),
        maxQuantity,
        lastTransactionTime: transactionTime,
        identifiers: []
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
  const [checkoutResult, setCheckoutResult] = useState<PostTransactionResult>();
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
        // Cart will remain in FETCHING_QUOTA state.
        if (e instanceof PolicyError) {
          setError(
            new Error(
              "Encountered an issue obtaining policies. We've noted this down and are looking into it!"
            )
          );
        } else if (e instanceof QuotaError) {
          setError(
            new Error(
              "Error getting quota. We've noted this down and are looking into it!"
            )
          );
        } else {
          setError(e);
        }
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
    (category, quantity, identifiers) => {
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
              quantity,
              identifiers
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

      let numUnverifiedTransactions = 0;
      let numIdentifiers = 0;
      const transactions = Object.values(cart)
        .filter(({ quantity }) => quantity)
        .map(({ category, quantity, identifiers }) => {
          if (
            identifiers.length > 0 &&
            identifiers.some(identifier => !identifier.value)
          ) {
            numUnverifiedTransactions += 1;
          }
          numIdentifiers += identifiers.length;
          return { category, quantity, identifiers };
        });

      if (numUnverifiedTransactions > 0) {
        setError(
          new Error(
            `Please enter ${
              numIdentifiers === 1 ? "code" : "unique codes"
            } to checkout`
          )
        );
        setCartState("DEFAULT");
        return;
      }

      if (transactions.length === 0) {
        setError(new Error("Please select at least one item to checkout"));
        setCartState("DEFAULT");
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
