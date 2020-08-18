import React, { FunctionComponent, useContext, useCallback } from "react";
import { NavigationProps, Policy } from "../../types";
import { ProductContext, ProductContextValue } from "../../context/products";
import { CustomerQuotaScreen } from "./CustomerQuotaScreen";

export const CustomerQuotaProxy: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  // coming from NRIC screen, it will be a string
  // coming from appeal, it can be an array if group appeal is supported
  const navId = navigation.getParam("id");
  const navIds = Array.isArray(navId) ? navId : [navId];

  const selectedProducts: Policy[] = navigation.getParam("products");

  // we have to replace getProduct as well. Because all the child component is invoking getProduct and it will retrieve from the parent context.
  // the products at the parent context is not what we are interested in
  const getProduct = useCallback(
    (category: string): Policy | undefined => {
      return selectedProducts.find(product => product.category === category);
    },
    [selectedProducts]
  );

  const existingProductContextValue = useContext(ProductContext);
  const updatedProductContextValue: ProductContextValue = {
    ...existingProductContextValue,
    getProduct,
    products: selectedProducts
  };

  return (
    <ProductContext.Provider value={updatedProductContextValue}>
      <CustomerQuotaScreen navigation={navigation} navIds={navIds} />
    </ProductContext.Provider>
  );
};
