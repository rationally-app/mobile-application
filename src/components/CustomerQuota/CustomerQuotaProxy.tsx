import React, { FunctionComponent } from "react";
import { CampaignPolicy, CustomerQuotaProxyNavigationProps } from "../../types";
import { ProductContextProvider } from "../../context/products";
import { CustomerQuotaScreen } from "./CustomerQuotaScreen";

export const CustomerQuotaProxy: FunctionComponent<
  CustomerQuotaProxyNavigationProps
> = ({ navigation, route }) => {
  // coming from NRIC screen, it will be a string
  // coming from appeal, it can be an array if group appeal is supported
  console.log("CustomerQuotaProxy, route.params", route.params);
  const navId = route.params?.id;
  const navIds: string[] = Array.isArray(navId) ? navId : [navId];

  console.log("CustomerQuotaProxy, navIds", navIds);

  const selectedProducts: CampaignPolicy[] = route.params?.products;
  console.log("CustomerQuotaProxy, CampaignPolicy[]", selectedProducts);

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
