export interface CartState {
  [category: string]: boolean | null;
}

export type ItemQuantities = {
  category: string;
  quantities: {
    [id: string]: number;
  };
};

export type PurchasedQuantitiesByItem = ItemQuantities[];
