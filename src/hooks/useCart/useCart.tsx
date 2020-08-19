import { useState, useEffect, useCallback, useContext } from "react";
import { Sentry } from "../../utils/errorTracking";
import {
  getQuota,
  postTransaction,
  QuotaError,
  NotEligibleError
} from "../../services/quota";
import { transform } from "lodash";
import { useProductContext, ProductContextValue } from "../../context/products";
import { usePrevious } from "../usePrevious";
import {
  PostTransactionResult,
  Quota,
  ItemQuota,
  IdentifierInput,
  Policy
} from "../../types";
import { validateIdentifierInputs } from "../../utils/validateIdentifierInputs";
import { AlertModalContext, ERROR_MESSAGE } from "../../context/alert";

export type CartItem = {
  category: string;
  quantity: number;
  maxQuantity: number;
  checkoutLimit?: number;
  descriptionAlert?: string;
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
  allQuotaResponse: Quota | null;
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

        let descriptionAlert: string | undefined = undefined;
        if (product && product.alert) {
          const expandedQuota = product.quantity.limit - maxQuantity;
          descriptionAlert =
            expandedQuota >= product.alert.threshold
              ? product.alert.label
              : undefined;
        }
        return {
          category,
          quantity: Math.min(
            Math.max(maxQuantity, 0),
            existingItem?.quantity || defaultQuantity
          ),
          maxQuantity: Math.max(maxQuantity, 0),
          checkoutLimit:
            existingItem?.checkoutLimit || product?.quantity.checkoutLimit,
          descriptionAlert,
          lastTransactionTime: transactionTime,
          identifierInputs: identifierInputs || defaultIdentifierInputs
        };
      }
    );
};

const filterQuotaWithAvailableProducts = (
  quota: Quota,
  products: Policy[]
): Quota => {
  const filteredQuota: Quota = { remainingQuota: [] };
  return transform(
    quota.remainingQuota,
    (result: Quota, itemQuota) => {
      if (products.some(policy => policy.category === itemQuota.category))
        result.remainingQuota.push(itemQuota);
    },
    filteredQuota
  );
};

const hasNoQuota = (quota: Quota): boolean =>
  quota.remainingQuota.every(item => item.quantity === 0);

const hasInvalidQuota = (quota: Quota): boolean =>
  // Note: Invalid quota refers to negative quota received
  quota.remainingQuota.some(item => item.quantity < 0);

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
  const prevProducts = usePrevious(products);
  const [cart, setCart] = useState<Cart>([]);
  const [cartState, setCartState] = useState<CartState>("DEFAULT");
  const [checkoutResult, setCheckoutResult] = useState<PostTransactionResult>();
  const [error, setError] = useState<Error>();
  const [quotaResponse, setQuotaResponse] = useState<Quota | null>(null);
  const [allQuotaResponse, setAllQuotaResponse] = useState<Quota | null>(null);
  const { showAlert } = useContext(AlertModalContext);
  const clearError = useCallback((): void => setError(undefined), []);

  /**
   * Fetch quota whenever IDs change.
   */
  useEffect(() => {
    const fetchQuota = async (): Promise<void> => {
      setCartState("FETCHING_QUOTA");
      try {
        const allQuotaResponse = await getQuota(ids, authKey, endpoint);
        setAllQuotaResponse(allQuotaResponse);
        const quotaResponse = filterQuotaWithAvailableProducts(
          allQuotaResponse,
          products
        );
        if (hasInvalidQuota(quotaResponse)) {
          Sentry.captureException(
            `Negative Quota Received: ${JSON.stringify(
              quotaResponse.remainingQuota
            )}`
          );
          setCartState("NO_QUOTA");
        } else if (hasNoQuota(quotaResponse)) {
          setCartState("NO_QUOTA");
        } else {
          setCartState("DEFAULT");
        }
        setQuotaResponse(quotaResponse);
      } catch (e) {
        if (e instanceof NotEligibleError) {
          setCartState("NOT_ELIGIBLE");
          // Cart will remain in FETCHING_QUOTA state.
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

    if (prevIds !== ids || prevProducts !== products) {
      fetchQuota();
    }
  }, [
    authKey,
    endpoint,
    getProduct,
    ids,
    prevIds,
    prevProducts,
    products,
    setProducts,
    setFeatures,
    showAlert
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
        setError(new Error(ERROR_MESSAGE.MISSING_SELECTION));
        setCartState("DEFAULT");
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
        if (e.message === ERROR_MESSAGE.DUPLICATE_POD_INPUT) {
          setError(e);
        } else {
          setError(new Error(ERROR_MESSAGE.SERVER_ERROR));
        }
        setCartState("DEFAULT");
        if (
          e.message === "Invalid Purchase Request: Duplicate identifier inputs"
        ) {
          setError(new Error(ERROR_MESSAGE.DUPLICATE_IDENTIFIER_INPUT));
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
    clearError,
    allQuotaResponse
  };
};
