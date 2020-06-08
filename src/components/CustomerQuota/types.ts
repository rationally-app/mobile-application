import { PolicyIdentifierInput } from "../../types";

export interface CartState {
  [category: string]: boolean | null;
}

export type ItemQuantities = {
  category: string;
  quantities: {
    [id: string]: number;
  };
  identifiers: PolicyIdentifierInput[];
};

export type CheckoutQuantitiesByItem = ItemQuantities[];
