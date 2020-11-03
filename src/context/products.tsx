import React, { createContext, FunctionComponent, useCallback } from "react";
import { CampaignPolicy } from "../types";

export interface ProductContextValue {
  products: CampaignPolicy[];
  getProduct: (category: string) => CampaignPolicy | undefined;
}

export const ProductContext = createContext<ProductContextValue>({
  products: [],
  getProduct: () => undefined,
});

export const ProductContextProvider: FunctionComponent<{
  products: CampaignPolicy[];
}> = ({ products, children }) => {
  const getProduct = useCallback(
    (category: string): CampaignPolicy | undefined =>
      products.find((product) => product.category === category),
    [products]
  );

  return (
    <ProductContext.Provider
      value={{
        products,
        getProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
