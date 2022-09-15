import React, { FunctionComponent } from "react";
import { CampaignPolicy, CustomerQuotaProxyNavigationProps } from "../../types";
import { ProductContextProvider } from "../../context/products";
import { CustomerQuotaScreen } from "./CustomerQuotaScreen";

export const CustomerQuotaProxy: FunctionComponent<
  CustomerQuotaProxyNavigationProps
> = ({ navigation, route }) => {
  // coming from NRIC screen, it will be a string
  // coming from appeal, it can be an array if group appeal is supported
  const navId = route.params?.id;
  const navIds: string[] = Array.isArray(navId) ? navId : [navId];
  const selectedProducts: CampaignPolicy[] = route.params?.products;

  return (
    <ProductContextProvider products={selectedProducts}>
      <CustomerQuotaScreen
        navIds={navIds}
        navigation={navigation}
        route={route}
      />
    </ProductContextProvider>
  );
};
