import { useState } from "react";
import { Sentry } from "../../utils/errorTracking";
import { getQuota } from "../../services/quota";
import { useProductContext } from "../../context/products";

import { transform } from "lodash";

import { Quota, Policy } from "../../types";

export type QuotaHook = {
  quotaResponse: Quota | null;
  allQuotaResponse: Quota | null;
  fetchQuota: () => Promise<void>;
  quotaError?: Error;
};

export const filterQuotaWithAvailableProducts = (
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

export const hasNoQuota = (quota: Quota | null): boolean => {
  if (quota === null) {
    return true;
  }
  return quota.remainingQuota.every(item => item.quantity === 0);
};

export const hasInvalidQuota = (quota: Quota | null): boolean => {
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
  const [quotaResponse, setQuotaResponse] = useState<Quota | null>(null);
  const [allQuotaResponse, setAllQuotaResponse] = useState<Quota | null>(null);
  const [quotaError, setError] = useState<Error>();
  const { products } = useProductContext();

  const fetchQuota = async (): Promise<void> => {
    Sentry.addBreadcrumb({
      category: "useQuota",
      message: "fetchQuota - fetching quota"
    });
    const allQuotaResponse = await getQuota(ids, authKey, endpoint);
    setAllQuotaResponse(allQuotaResponse);
    const quotaResponse = filterQuotaWithAvailableProducts(
      allQuotaResponse,
      products
    );
    setQuotaResponse(quotaResponse);
  };

  return {
    quotaResponse,
    allQuotaResponse,
    fetchQuota,
    quotaError
  };
};
