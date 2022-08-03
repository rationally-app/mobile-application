import React, { FunctionComponent } from "react";
import { CampaignPolicy, CustomerQuotaStackParamList } from "../../types";
import { ProductContextProvider } from "../../context/products";
import { CustomerQuotaScreen } from "./CustomerQuotaScreen";
import { StackScreenProps } from "@react-navigation/stack";
import { useRoute } from "@react-navigation/native";

type Props = StackScreenProps<
  CustomerQuotaStackParamList,
  "CustomerQuotaProxy"
>;

export const CustomerQuotaProxy: FunctionComponent<Props> = ({}) => {
  // coming from NRIC screen, it will be a string
  // coming from appeal, it can be an array if group appeal is supported
  const route = useRoute();
  console.log("CustomerQuotaProxy, route.params", route.params);
  const navId = route.params?.id;
  const navIds: string[] = Array.isArray(navId) ? navId : [navId];

  console.log("CustomerQuotaProxy, navIds", navIds);

  const selectedProducts: CampaignPolicy[] = route.params?.products;
  console.log("CustomerQuotaProxy, CampaignPolicy[]", selectedProducts);

  return (
    <ProductContextProvider products={selectedProducts}>
      <CustomerQuotaScreen navIds={navIds} />
    </ProductContextProvider>
  );
};
