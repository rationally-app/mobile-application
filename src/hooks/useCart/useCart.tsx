import { useState, useEffect, useCallback } from "react";
import {
  getQuota,
  postTransaction,
  QuotaError,
  NotEligibleError
} from "../../services/quota";
import { useProductContext, ProductContextValue } from "../../context/products";
import { getEnvVersion, EnvVersionError } from "../../services/envVersion";
import { usePrevious } from "../usePrevious";
import {
  PostTransactionResult,
  Quota,
  ItemQuota,
  IdentifierInput
} from "../../types";
import { validateIdentifierInputs } from "../../utils/validateIdentifierInputs";

export type CartItem = {
  category: string;
  quantity: number;
  maxQuantity: number;
  /**
   * Indicates the previous time quota was used.
   * It will be undefined for batch quotas.
   */
  lastTransactionTime?: Date;
  identifierInputs: IdentifierInput[];
};

export type Cart = CartItem[];

type CartState =
  | "FETCHING_QUOTA"
  | "NO_QUOTA"
  | "DEFAULT"
  | "CHECKING_OUT"
  | "PURCHASED"
  | "NOT_ELIGIBLE";

export type CartHook = {
  cartState: CartState;
  cart: Cart;
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
        quantity: maxQuantity,
        transactionTime,
        identifierInputs
      }) => {
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

        return {
          category,
          quantity: Math.min(
            maxQuantity,
            existingItem?.quantity || defaultQuantity
          ),
          maxQuantity,
          lastTransactionTime: transactionTime,
          identifierInputs: identifierInputs || defaultIdentifierInputs
        };
      }
    );
};

const hasNoQuota = (quota: Quota): boolean =>
  quota.remainingQuota.every(item => item.quantity === 0);

const isUniqueList = (list: string[]): boolean =>
  new Set(list).size === list.length;

export const useCart = (
  ids: string[],
  authKey: string,
  endpoint: string
): CartHook => {
  const prevIds = usePrevious(ids);
  const {
    products,
    getProduct,
    setProducts,
    setFeatures
  } = useProductContext();
  const [cart, setCart] = useState<Cart>([]);
  const [cartState, setCartState] = useState<CartState>("DEFAULT");
  const [checkoutResult, setCheckoutResult] = useState<PostTransactionResult>();
  const [error, setError] = useState<Error>();
  const [quotaResponse, setQuotaResponse] = useState<Quota | null>(null);

  const clearError = useCallback((): void => setError(undefined), []);

  /**
   * Fetch quota whenever IDs change.
   */
  useEffect(() => {
    const fetchQuota = async (): Promise<void> => {
      setCartState("FETCHING_QUOTA");
      try {
        if (products.length === 0) {
          const response = await getEnvVersion(authKey, endpoint);
          setProducts(response.policies);
          setFeatures(response.features);
        }
        const quotaResponse = await getQuota(ids, authKey, endpoint);
        if (hasNoQuota(quotaResponse)) {
          setCartState("NO_QUOTA");
        } else {
          setCartState("DEFAULT");
        }
        setQuotaResponse(quotaResponse);
      } catch (e) {
        if (e instanceof NotEligibleError) {
          setCartState("NOT_ELIGIBLE");
          // Cart will remain in FETCHING_QUOTA state.
        } else if (e instanceof EnvVersionError) {
          setError(
            new Error(
              "Encountered an issue obtaining environment information. We've noted this down and are looking into it!"
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
    setProducts,
    setFeatures
  ]);

  /**
   * Merge quota response with current cart whenever quota response or products change.
   */
  useEffect(() => {
    if (quotaResponse) {
      // Note that we must use a callback within this setState to avoid
      // having cart as a dependency which causes an infinite loop.
      setCart(cart =>
        mergeWithCart(cart, quotaResponse.remainingQuota, getProduct)
      );
    }
  }, [quotaResponse, products, getProduct]);

  /**
   * Update quantity of an item in the cart.
   */
  const updateCart: CartHook["updateCart"] = useCallback(
    (category, quantity, identifierInputs) => {
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
              identifierInputs:
                identifierInputs || cart[itemIdx].identifierInputs
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
      const allIdentifierInputs: IdentifierInput[] = [];
      const transactions = Object.values(cart)
        .filter(({ quantity }) => quantity)
        .map(({ category, quantity, identifierInputs }) => {
          if (
            identifierInputs.length > 0 &&
            identifierInputs.some(identifierInput => !identifierInput.value)
          ) {
            numUnverifiedTransactions += 1;
          }
          allIdentifierInputs.push(...identifierInputs);

          numIdentifiers += identifierInputs.length;
          return { category, quantity, identifierInputs };
        });

      if (transactions.length === 0) {
        setError(new Error("Please select at least one item to checkout"));
        setCartState("DEFAULT");
        return;
      }

      if (
        numUnverifiedTransactions > 0 ||
        !isUniqueList(
          allIdentifierInputs.map(identifierInput => identifierInput.value)
        )
      ) {
        setError(
          new Error(
            `Please enter ${
              numIdentifiers === 1 ? "" : "unique "
            }details to checkout`
          )
        );
        setCartState("DEFAULT");
        return;
      }

      try {
        validateIdentifierInputs(allIdentifierInputs);
      } catch (error) {
        setError(error);
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
