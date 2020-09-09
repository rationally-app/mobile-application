import { useState, useContext } from "react";
import { Sentry } from "../../utils/errorTracking";
import { getQuota } from "../../services/quota";
import { ProductContext } from "../../context/products";

import { transform } from "lodash";

import { Quota, CampaignPolicy } from "../../types";

export type QuotaHook = {
  quotaResponse: Quota | null;
  allQuotaResponse: Quota | null;
  fetchQuota: () => Promise<Quota | null>;
  hasNoQuota: (quota?: Quota | null) => boolean;
  hasInvalidQuota: (quota?: Quota | null) => boolean;
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

export const useQuota = (
  ids: string[],
  authKey: string,
  endpoint: string
): QuotaHook => {
  const [quotaResponse, setQuotaResponse] = useState<Quota | null>(null);
  const [allQuotaResponse, setAllQuotaResponse] = useState<Quota | null>(null);
  const { products } = useContext(ProductContext);

  const fetchQuota = async (): Promise<Quota | null> => {
    Sentry.addBreadcrumb({
      category: "useQuota",
      message: "fetchQuota - fetching quota"
    });
    const _allQuotaResponse = await getQuota(ids, authKey, endpoint);
    setAllQuotaResponse(_allQuotaResponse);
    const _quotaResponse = filterQuotaWithAvailableProducts(
      _allQuotaResponse,
      products
    );
    setQuotaResponse(_quotaResponse);
    return _quotaResponse;
  };

  const hasNoQuota = (quota: Quota | null = quotaResponse): boolean => {
    if (quota === null) {
      return true;
    }
    return quota.remainingQuota.every(item => item.quantity === 0);
  };

  const hasInvalidQuota = (quota: Quota | null = quotaResponse): boolean => {
    // Note: Invalid quota refers to negative quota received
    if (quota === null) {
      return true;
    }
    return quota.remainingQuota.some(item => item.quantity < 0);
  };

  return {
    quotaResponse,
    allQuotaResponse,
    fetchQuota,
    hasNoQuota,
    hasInvalidQuota
  };
};
