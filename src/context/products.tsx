import React, {
  createContext,
  useContext,
  FunctionComponent,
  useState
} from "react";

interface Product {
  category: string;
  name: string;
  unit: string;
  period?: number;
  quantityLimit?: number;
  order: number;
}

interface ProductContext {
  products: Product[];
  setProducts: (products: Product[]) => void;
  getProduct: (category: string) => Product | undefined;
}

export const ProductContext = createContext<ProductContext>({
  products: [],
  setProducts: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  getProduct: () => undefined
});

export const useProductContext = (): ProductContext =>
  useContext<ProductContext>(ProductContext);

export const ProductContextProvider: FunctionComponent = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const getProduct = (category: string): Product | undefined =>
    products.find(product => product.category === category);

  return (
    <ProductContext.Provider value={{ products, setProducts, getProduct }}>
      {children}
    </ProductContext.Provider>
  );
};
