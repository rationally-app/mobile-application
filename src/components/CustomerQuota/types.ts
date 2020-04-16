export interface CartState {
  [category: string]: boolean | null;
}

export type CategoryQuantities = {
  category: string;
  quantities: {
    [id: string]: number;
  };
};

export type CheckoutResultByCategory = CategoryQuantities[];
