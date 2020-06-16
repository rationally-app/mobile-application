import React, {
  createContext,
  useContext,
  FunctionComponent,
  useState,
  useCallback
} from "react";
import { Policy, Feature } from "../types";

export interface ProductContextValue {
  products: Policy[];
  features: Feature | undefined;
  setProducts: (products: Policy[]) => void;
  getProduct: (category: string) => Policy | undefined;
  setFeatures: (features: Feature) => void;
  getFeature: () => Feature | undefined;
}

export const ProductContext = createContext<ProductContextValue>({
  products: [],
  features: {
    REQUIRE_OTP: false,
    TRANSACTION_GROUPING: false
  },
  setProducts: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  getProduct: () => undefined,
  setFeatures: () => {}, // eslint-disable-line @typesc ript-eslint/no-empty-function
  getFeature: () => undefined
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

  const [features, setFeatures] = useState<Feature>();
  const getFeature = useCallback((): Feature | undefined => features, [
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
        getFeature
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
