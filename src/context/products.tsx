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
  appeals: Appeal[];
  setProducts: (products: Policy[]) => void;
  getProduct: (category: string) => Policy | undefined;
  setFeatures: (features: Features) => void;
  getFeatures: () => Features | undefined;
  setAppeals: (appeal: Appeal[]) => void;
  getAppeal: (category: string) => Appeal | undefined;
}

export const ProductContext = createContext<ProductContextValue>({
  products: [],
  features: {} as Features,
  appeals: [],
  setProducts: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  getProduct: () => undefined,
  setFeatures: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  getFeatures: () => undefined,
  setAppeals: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
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

  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const getAppeal = useCallback(
    (category: string): Appeal | undefined =>
      appeals.find(appeal => appeal.category === category),
    [appeals]
  );

  return (
    <ProductContext.Provider
      value={{
        products,
        features,
        appeals,
        setProducts,
        getProduct,
        setFeatures,
        getFeatures,
        setAppeals,
        getAppeal
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
