import { useState, useContext, useCallback, useEffect } from "react";
import { Sentry } from "../../utils/errorTracking";
import { getQuota, NotEligibleError } from "../../services/quota";
import { ProductContext } from "../../context/products";
import { transform } from "lodash";
import { Quota, CampaignPolicy, ItemQuota } from "../../types";
import { usePrevious } from "../usePrevious";

type QuotaState = "DEFAULT" | "FETCHING_QUOTA" | "NO_QUOTA" | "NOT_ELIGIBLE";

export type QuotaHook = {
  quotaState: string;
  // Contains only quota of products with categories available in the current campaign policy
  quotaResponse?: Quota;
  // Contains quota of all products
  allQuotaResponse?: Quota;
  updateQuota: () => void;
  quotaError?: Error;
  clearQuotaError: () => void;
};

const filterQuotaWithAvailableProducts = (
  quota: Quota,
  products: CampaignPolicy[]
): Quota => {
  const filteredQuota: Quota = {
    remainingQuota: [],
    globalQuota: [],
    localQuota: []
  };

  transform(
    quota.remainingQuota,
    (result: Quota, itemQuota) => {
      if (products.some(policy => policy.category === itemQuota.category))
        result.remainingQuota.push(itemQuota);
    },
    filteredQuota
  );

  transform(
    quota.globalQuota,
    (result: Quota, itemQuota) => {
      if (products.some(policy => policy.category === itemQuota.category))
        result.globalQuota.push(itemQuota);
    },
    filteredQuota
  );

  transform(
    quota.localQuota,
    (result: Quota, itemQuota) => {
      if (products.some(policy => policy.category === itemQuota.category))
        result.localQuota.push(itemQuota);
    },
    filteredQuota
  );

  return filteredQuota;
};

const hasNoQuota = (quota: Quota): boolean => {
  return quota.remainingQuota.every(item => item.quantity === 0);
};

const hasInvalidQuota = (quota: Quota): boolean => {
  // Note: Invalid quota refers to negative quota received
  if (quota === null) {
    return true;
  }
  return quota.remainingQuota.some(item => item.quantity < 0);
};

export const hasInvalidRemainingQuota = (itemQuotas: ItemQuota[]): boolean => {
  if (!itemQuotas || itemQuotas.length === 0) {
    return true;
  }
  return itemQuotas.some(quota => quota.quantity < 0);
};

/**
 * Please note that the updateQuota hook is called on initialisation, and can also be
 * called imperatively.
 */
export const useQuota = (
  ids: string[],
  authKey: string,
  endpoint: string
): QuotaHook => {
  const [quotaState, setQuotaState] = useState<QuotaState>("DEFAULT");
  const [quotaResponse, setQuotaResponse] = useState<Quota>();
  const [allQuotaResponse, setAllQuotaResponse] = useState<Quota>();
  const [quotaError, setQuotaError] = useState<Error>();
  const clearQuotaError = useCallback((): void => setQuotaError(undefined), []);
  const { products } = useContext(ProductContext);
  const prevIds = usePrevious(ids);
  const prevProducts = usePrevious(products);

  const updateQuota: QuotaHook["updateQuota"] = useCallback(() => {
    const update = async (): Promise<void> => {
      try {
        setQuotaState("FETCHING_QUOTA");
        const quota = await getQuota(ids, authKey, endpoint);
        if (hasInvalidQuota(quota)) {
          Sentry.captureException(
            `Negative Quota Received: ${JSON.stringify(
              quotaResponse?.remainingQuota
            )}`
          );
          setQuotaState("NO_QUOTA");
        } else if (hasNoQuota(quota)) {
          setQuotaState("NO_QUOTA");
        } else {
          setQuotaState("DEFAULT");
        }
        setAllQuotaResponse(quota);
        const filteredQuotas = filterQuotaWithAvailableProducts(
          quota,
          products
        );
        setQuotaResponse(filteredQuotas);
      } catch (e) {
        if (e instanceof NotEligibleError) {
          setQuotaState("NOT_ELIGIBLE");
          return;
        } else {
          setQuotaState("DEFAULT");
          setQuotaError(e);
        }
      }
    };
    update();
  }, [ids, authKey, endpoint, products, quotaResponse]);

  /**
   * Update the quota whenever the ids or products change
   */
  useEffect(() => {
    if (prevIds !== ids || prevProducts !== products) {
      updateQuota();
    }
  }, [prevIds, ids, prevProducts, products, updateQuota]);

  return {
    quotaState,
    quotaResponse,
    allQuotaResponse,
    updateQuota,
    quotaError,
    clearQuotaError
  };
};
