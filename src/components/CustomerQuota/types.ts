import { IdentifierInput } from "../../types";

export interface CartState {
  [category: string]: boolean | null;
}

export type ItemQuantities = {
  category: string;
  quantities: {
    [id: string]: number;
  };
  identifierInputs?: IdentifierInput[];
};

export type CheckoutQuantitiesByItem = ItemQuantities[];
