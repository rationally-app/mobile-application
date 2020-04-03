import React, {
  createContext,
  useContext,
  FunctionComponent,
  useState
} from "react";
import { Policy } from "../types";

interface ProductContext {
  products: Policy[];
  setProducts: (products: Policy[]) => void;
  getProduct: (category: string) => Policy | undefined;
}

export const ProductContext = createContext<ProductContext>({
  products: [],
  setProducts: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  getProduct: () => undefined
});

export const useProductContext = (): ProductContext =>
  useContext<ProductContext>(ProductContext);

export const ProductContextProvider: FunctionComponent = ({ children }) => {
  const [products, setProducts] = useState<Policy[]>([]);
  const getProduct = (category: string): Policy | undefined =>
    products.find(product => product.category === category);

  return (
    <ProductContext.Provider value={{ products, setProducts, getProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
