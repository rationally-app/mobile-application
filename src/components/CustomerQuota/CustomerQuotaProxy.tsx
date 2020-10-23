import React, { FunctionComponent } from "react";
import { NavigationProps, CampaignPolicy } from "../../types";
import { ProductContextProvider } from "../../context/products";
import { CustomerQuotaScreen } from "./CustomerQuotaScreen";

export const CustomerQuotaProxy: FunctionComponent<NavigationProps> = ({
  navigation,
}) => {
  // coming from NRIC screen, it will be a string
  // coming from appeal, it can be an array if group appeal is supported
  const navId = navigation.getParam("id");
  const navIds = Array.isArray(navId) ? navId : [navId];

  const selectedProducts: CampaignPolicy[] = navigation.getParam("products");

  return (
    <ProductContextProvider products={selectedProducts}>
      <CustomerQuotaScreen navigation={navigation} navIds={navIds} />
    </ProductContextProvider>
  );
};
