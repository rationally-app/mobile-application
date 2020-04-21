import React, {
  createContext,
  useContext,
  FunctionComponent,
  useState,
  useCallback
} from "react";
import { Policy } from "../types";

export interface ProductContextValue {
  products: Policy[];
  setProducts: (products: Policy[]) => void;
  getProduct: (category: string) => Policy | undefined;
}

export const ProductContext = createContext<ProductContextValue>({
  products: [],
  setProducts: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  getProduct: () => undefined
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

  return (
    <ProductContext.Provider value={{ products, setProducts, getProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
