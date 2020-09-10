import { useState, useContext, useCallback, useEffect } from "react";
import { Sentry } from "../../utils/errorTracking";
import { getQuota, NotEligibleError, QuotaError } from "../../services/quota";
import { ProductContext } from "../../context/products";
import { transform } from "lodash";
import { Quota, CampaignPolicy } from "../../types";
import { usePrevious } from "../usePrevious";

type QuotaState = "DEFAULT" | "FETCHING_QUOTA" | "NO_QUOTA" | "NOT_ELIGIBLE";

export type QuotaHook = {
  quotaState: string;
  quotaResponse: Quota | null;
  allQuotaResponse: Quota | null;
  updateQuota: () => void;
  quotaError?: Error;
};

const filterQuotaWithAvailableProducts = (
  quota: Quota,
  products: CampaignPolicy[]
): Quota => {
  const filteredQuota: Quota = {
    remainingQuota: []
  };
  transform(
    quota.remainingQuota,
    (result: Quota, itemQuota) => {
      if (products.some(policy => policy.category === itemQuota.category))
        result.remainingQuota.push(itemQuota);
    },
    filteredQuota
  );

  if (quota.globalQuota) {
    filteredQuota.globalQuota = [];
    transform(
      quota.globalQuota!,
      (result: Quota, itemQuota) => {
        if (products.some(policy => policy.category === itemQuota.category))
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
        if (products.some(policy => policy.category === itemQuota.category))
          result.localQuota!.push(itemQuota);
      },
      filteredQuota
    );
  }

  return filteredQuota;
};

const hasNoQuota = (quota: Quota): boolean => {
  if (quota === null) {
    return true;
  }
  return quota.remainingQuota.every(item => item.quantity === 0);
};

const hasInvalidQuota = (quota: Quota): boolean => {
  // Note: Invalid quota refers to negative quota received
  if (quota === null) {
    return true;
  }
  return quota.remainingQuota.some(item => item.quantity < 0);
};

export const useQuota = (
  ids: string[],
  authKey: string,
  endpoint: string
): QuotaHook => {
  const [quotaState, setQuotaState] = useState<QuotaState>("DEFAULT");
  const [quotaResponse, setQuotaResponse] = useState<Quota | null>(null);
  const [allQuotaResponse, setAllQuotaResponse] = useState<Quota | null>(null);
  const [quotaError, setQuotaError] = useState<Error>();
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
        } else if (e instanceof QuotaError) {
          Sentry.addBreadcrumb({
            category: "useQuota",
            message: "fetchQuota - quota error"
          });
          setQuotaError(
            new Error(
              "Error getting quota. We've noted this down and are looking into it!"
            )
          );
        } else {
          Sentry.addBreadcrumb({
            category: "useQuota",
            message: "fetchQuota - unidentified error"
          });
          setQuotaError(e);
        }
      }
    };
    update();
  }, [ids, authKey, endpoint, products, quotaResponse]);

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
    quotaError
  };
};
