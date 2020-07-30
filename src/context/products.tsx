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
  allProducts: Policy[];
  setProducts: (products: Policy[]) => void;
  getProduct: (category: string) => Policy | undefined;
  setFeatures: (features: Features) => void;
  getFeatures: () => Features | undefined;
  setAllProducts: (allProducts: Policy[]) => void;
}

export const ProductContext = createContext<ProductContextValue>({
  products: [],
  features: {} as Features,
  allProducts: [],
  setProducts: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  getProduct: () => undefined,
  setFeatures: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  getFeatures: () => undefined,
  setAllProducts: () => {} // eslint-disable-line @typescript-eslint/no-empty-function
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

  const [allProducts, setAllProducts] = useState<Policy[]>([]);

  return (
    <ProductContext.Provider
      value={{
        products,
        features,
        allProducts,
        setProducts,
        getProduct,
        setFeatures,
        getFeatures,
        setAllProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
