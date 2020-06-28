import React, {
  createContext,
  useContext,
  FunctionComponent,
  useState,
  useCallback
} from "react";
import { Policy, Features } from "../types";

export interface ProductContextValue {
  products: Policy[];
  features: Features | undefined;
  setProducts: (products: Policy[]) => void;
  getProduct: (category: string) => Policy | undefined;
  setFeatures: (features: Features) => void;
  getFeatures: () => Features | undefined;
}

export const ProductContext = createContext<ProductContextValue>({
  products: [],
  features: {
    REQUIRE_OTP: false,
    TRANSACTION_GROUPING: false,
    DIST_ENV: ""
  },
  setProducts: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  getProduct: () => undefined,
  setFeatures: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  getFeatures: () => undefined
});

export const useProductContext = (): ProductContextValue =>
  useContext<ProductContextValue>(ProductContext);

export const ProductContextProvider: FunctionComponent = ({ children }) => {
  const [products, setProducts] = useState<Policy[]>([]);
  const getProduct = useCallback(
    (category: string): Policy | undefined =>
      products.find(product => product.category === category),
    [products]
  );

  const [features, setFeatures] = useState<Features>();
  const getFeatures = useCallback((): Features | undefined => features, [
    features
  ]);

  return (
    <ProductContext.Provider
      value={{
        products,
        features,
        setProducts,
        getProduct,
        setFeatures,
        getFeatures
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
