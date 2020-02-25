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
}

interface ProductContext {
  products: Product[];
  setProducts: (products: Product[]) => void;
}

export const ProductContext = createContext<ProductContext>({
  products: [],
  setProducts: () => {} // eslint-disable-line @typescript-eslint/no-empty-function
});

export const useProductContext = (): ProductContext =>
  useContext<ProductContext>(ProductContext);

export const ProductContextProvider: FunctionComponent = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const getProduct = (category: string): Product | undefined => {
  const { products } = useProductContext();
  return products.find(product => product.category === category);
};
