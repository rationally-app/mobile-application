import { useState, useEffect, useCallback, useContext } from "react";
import { Sentry } from "../../utils/errorTracking";
import {
  getQuota,
  postTransaction,
  reserveTransaction,
  commitTransaction,
  cancelTransaction,
  NotEligibleError,
} from "../../services/quota";
import { transform } from "lodash";
import { ProductContextValue, ProductContext } from "../../context/products";
import { usePrevious } from "../usePrevious";
import {
  PostTransactionResult,
  Quota,
  ItemQuota,
  IdentifierInput,
  CampaignPolicy,
  TransactionIdentifier,
} from "../../types";
import { validateIdentifierInputs } from "../../utils/validateIdentifierInputs";
import { ERROR_MESSAGE } from "../../context/alert";
import { SessionError } from "../../services/helpers";
import { IdentificationContext } from "../../context/identification";

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

type CartState =
  | "FETCHING_QUOTA"
  | "NO_QUOTA"
  | "DEFAULT"
  | "RESERVING"
  | "RESERVED"
  | "COMMITTING"
  | "CANCELLING"
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
  reserveCart: (onComplete: () => void) => void;
  commitCart: () => void;
  checkoutCart: () => void;
  cancelCart: (onComplete: () => void) => void;
  checkoutResult?: PostTransactionResult;
  error?: Error;
  clearError: () => void;
  allQuotaResponse: Quota | null;
  quotaResponse: Quota | null;
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
        identifierInputs,
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
              ...(validationRegex ? { validationRegex } : {}),
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
          identifierInputs: identifierInputs || defaultIdentifierInputs,
        };
      }
    );
};

const filterQuotaWithAvailableProducts = (
  quota: Quota,
  products: CampaignPolicy[]
): Quota => {
  const filteredQuota: Quota = {
    remainingQuota: [],
  };
  transform(
    quota.remainingQuota,
    (result: Quota, itemQuota) => {
      if (products.some((policy) => policy.category === itemQuota.category))
        result.remainingQuota.push(itemQuota);
    },
    filteredQuota
  );

  if (quota.globalQuota) {
    filteredQuota.globalQuota = [];
    transform(
      quota.globalQuota!,
      (result: Quota, itemQuota) => {
        if (products.some((policy) => policy.category === itemQuota.category))
          result.globalQuota!.push(itemQuota);
      },
      filteredQuota
    );
  }

  if (quota.localQuota) {
    filteredQuota.localQuota = [];
    transform(
      quota.localQuota!,
      (result: Quota, itemQuota) => {
        if (products.some((policy) => policy.category === itemQuota.category))
          result.localQuota!.push(itemQuota);
      },
      filteredQuota
    );
  }

  return filteredQuota;
};

const hasNoQuota = (quota: Quota): boolean =>
  quota.remainingQuota.every((item) => item.quantity === 0);

const hasInvalidQuota = (quota: Quota): boolean =>
  // Note: Invalid quota refers to negative quota received
  quota.remainingQuota.some((item) => item.quantity < 0);

export const useCart = (
  ids: string[],
  authKey: string,
  endpoint: string
): CartHook => {
  const prevIds = usePrevious(ids);
  const { products, getProduct } = useContext(ProductContext);
  const { selectedIdType } = useContext(IdentificationContext);
  const prevProducts = usePrevious(products);
  const [cart, setCart] = useState<Cart>([]);
  const [cartState, setCartState] = useState<CartState>("DEFAULT");
  const [checkoutResult, setCheckoutResult] = useState<PostTransactionResult>();
  const [error, setError] = useState<Error>();
  const [quotaResponse, setQuotaResponse] = useState<Quota | null>(null);
  const [allQuotaResponse, setAllQuotaResponse] = useState<Quota | null>(null);
  const clearError = useCallback((): void => setError(undefined), []);

  /**
   * Fetch quota whenever IDs change.
   */
  useEffect(() => {
    const fetchQuota = async (): Promise<void> => {
      setCartState("FETCHING_QUOTA");
      try {
        const allQuotaResponse = await getQuota(
          ids,
          selectedIdType,
          authKey,
          endpoint
        );
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
          return;
        } else {
          setError(e);
        }
        setCartState("DEFAULT");
      }
    };

    if (prevIds !== ids || prevProducts !== products) {
      fetchQuota();
    }
  }, [authKey, endpoint, ids, selectedIdType, prevIds, prevProducts, products]);

  /**
   * Merge quota response with current cart whenever quota response or products change.
   */
  useEffect(() => {
    if (quotaResponse) {
      // Note that we must use a callback within this setState to avoid
      // having cart as a dependency which causes an infinite loop.
      setCart((cart) =>
        mergeWithCart(cart, quotaResponse.remainingQuota, getProduct)
      );
    }
  }, [quotaResponse, products, getProduct]);

  const emptyCart: CartHook["emptyCart"] = useCallback(() => {
    setCart([]);
  }, []);

  /**
   * After checkout, update quota response
   */
  useEffect(() => {
    if (cartState === "PURCHASED") {
      const updateQuotaResponse = async (): Promise<void> => {
        const allQuotaResponse = await getQuota(
          ids,
          selectedIdType,
          authKey,
          endpoint
        );
        const quotaResponse = filterQuotaWithAvailableProducts(
          allQuotaResponse,
          products
        );
        setQuotaResponse(quotaResponse);
      };
      updateQuotaResponse();
    }
  }, [ids, selectedIdType, authKey, endpoint, cartState, products]);

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
                identifierInputs || cart[itemIdx].identifierInputs,
            },
            ...cart.slice(itemIdx + 1),
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
   * Handles the reserving of the cart.
   * Sets checkoutResult to the response of the post transaction.
   */

  const reserveCart: CartHook["reserveCart"] = useCallback(
    (onComplete: () => void) => {
      const reserve = async (): Promise<void> => {
        setCartState("RESERVING");
        const allIdentifierInputs: IdentifierInput[] = [];
        const transactions = Object.values(cart)
          .filter(({ quantity }) => quantity)
          .map(({ category, quantity, identifierInputs }) => {
            if (
              identifierInputs.length > 0 &&
              identifierInputs.some((identifierInput) => !identifierInput.value)
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
          const transactionResponse = await reserveTransaction({
            ids,
            identificationFlag: selectedIdType,
            key: authKey,
            transactions,
            endpoint,
          });
          setCheckoutResult(transactionResponse);
          setCartState("RESERVED");
          onComplete();
        } catch (e) {
          setCartState("DEFAULT");
          if (
            e.message ===
            "Invalid Purchase Request: Duplicate identifier inputs"
          ) {
            setError(new Error(ERROR_MESSAGE.DUPLICATE_IDENTIFIER_INPUT));
          } else if (e instanceof SessionError) {
            setError(e);
          } else {
            setError(new Error(ERROR_MESSAGE.SERVER_ERROR));
          }
        }
      };

      reserve();
    },
    [authKey, cart, endpoint, ids, selectedIdType]
  );

  const commitCart: CartHook["commitCart"] = useCallback(() => {
    const commit = async (): Promise<void> => {
      setCartState("COMMITTING");
      // create array of transaction identifiers
      const transactionIdentifiers: TransactionIdentifier[] = [];
      const transactions = checkoutResult?.transactions;
      if (transactions) {
        ids.forEach((id: string, index: number) => {
          const thisIdTransactions = transactions[index];
          const baseTimestamp = thisIdTransactions.timestamp.valueOf();
          thisIdTransactions.transaction.forEach((txn, idx) => {
            transactionIdentifiers.push({
              id,
              transactionTime: baseTimestamp + idx,
            });
          });
        });
      }
      //commit the transactions
      try {
        const commitResponse = await commitTransaction({
          key: authKey,
          endpoint,
          transactionIdentifiers,
        });

        if (checkoutResult) {
          const newCheckoutResult: PostTransactionResult = {
            ...checkoutResult,
          };
          let timestampPointer = 0;
          checkoutResult.transactions.forEach((id_txn, idx) => {
            newCheckoutResult.transactions[idx].timestamp =
              commitResponse.transactions[timestampPointer].timestamp;
            id_txn.transaction.forEach((txn) => {
              timestampPointer++;
            });
          });
          setCheckoutResult(newCheckoutResult);
        }

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

    if (cartState == "RESERVED") {
      commit();
    } else {
      setError(new Error("Nothing to commit."));
    }
  }, [cartState, authKey, endpoint, checkoutResult, ids]);

  const cancelCart: CartHook["cancelCart"] = useCallback(
    (onComplete: () => void) => {
      const cancel = async (): Promise<void> => {
        setCartState("CANCELLING");
        // create array of transaction identifiers
        const transactionIdentifiers: TransactionIdentifier[] = [];
        const transactions = checkoutResult?.transactions;
        if (transactions) {
          ids.forEach((id: string, index: number) => {
            const thisIdTransactions = transactions[index];
            const baseTimestamp = thisIdTransactions.timestamp.valueOf();
            thisIdTransactions.transaction.forEach((txn, idx) => {
              transactionIdentifiers.push({
                id,
                transactionTime: baseTimestamp + idx,
              });
            });
          });
        }

        try {
          const cancelResponse = await cancelTransaction({
            key: authKey,
            endpoint,
            transactionIdentifiers,
          });
          Sentry.addBreadcrumb({
            category: "useCart",
            message: `deleted transactions: ${cancelResponse}`,
          });

          setCheckoutResult(undefined);
          setCartState("DEFAULT");
          onComplete();
        } catch (e) {
          setCartState("DEFAULT");
          if (e instanceof SessionError) {
            setError(e);
          } else {
            setError(new Error(ERROR_MESSAGE.SERVER_ERROR));
          }
        }
      };

      if (cartState == "RESERVED") {
        cancel();
      } else {
        setError(new Error("Nothing to cancel."));
      }
    },
    [cartState, authKey, endpoint, checkoutResult, ids]
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
            identifierInputs.some((identifierInput) => !identifierInput.value)
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
          identificationFlag: selectedIdType,
          key: authKey,
          transactions,
          endpoint,
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
  }, [authKey, cart, endpoint, ids, selectedIdType]);

  return {
    cartState,
    cart,
    emptyCart,
    updateCart,
    reserveCart,
    commitCart,
    checkoutCart,
    cancelCart,
    checkoutResult,
    error,
    clearError,
    allQuotaResponse,
    quotaResponse,
  };
};
