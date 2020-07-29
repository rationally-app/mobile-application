import React, {
  createContext,
  useContext,
  FunctionComponent,
  useState,
  useCallback
} from "react";
import { Policy, Features, Appeal } from "../types";

export interface ProductContextValue {
  products: Policy[];
  features: Features | undefined;
  appeal?: Appeal[];
  setProducts: (products: Policy[]) => void;
  getProduct: (category: string) => Policy | undefined;
  setFeatures: (features: Features) => void;
  getFeatures: () => Features | undefined;
  setAppeal: (appeal: Appeal[] | undefined) => void;
  getAppeal: () => Appeal[] | undefined;
}

export const ProductContext = createContext<ProductContextValue>({
  products: [],
  features: {} as Features,
  setProducts: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  getProduct: () => undefined,
  setFeatures: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  getFeatures: () => undefined,
  setAppeal: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  getAppeal: () => undefined
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

  const [appeal, setAppeal] = useState<Appeal[]>();
  const getAppeal = useCallback((): Appeal[] | undefined => appeal, [appeal]);

  return (
    <ProductContext.Provider
      value={{
        products,
        features,
        setProducts,
        getProduct,
        setFeatures,
        getFeatures,
        setAppeal,
        getAppeal
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
