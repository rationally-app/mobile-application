import React, { FunctionComponent } from "react";
import { EnvVersion, Features, Policy, PolicyIdentifier } from "../../types";
import { ProductContext } from "../../context/products";

const defaultIdentifier: PolicyIdentifier = {
  label: "identifier",
  textInput: { visible: true, disabled: false, type: "STRING" },
  scanButton: { visible: true, disabled: false, type: "BARCODE" }
};

const defaultProducts: EnvVersion = {
  policies: [
    {
      category: "toilet-paper",
      name: "Toilet Paper",
      description: "",
      order: 1,
      quantity: {
        period: 7,
        limit: 2,
        default: 1,
        unit: {
          type: "POSTFIX",
          label: " roll"
        }
      },
      identifiers: [
        {
          ...defaultIdentifier,
          label: "first"
        },
        {
          ...defaultIdentifier,
          label: "last"
        }
      ]
    },
    {
      category: "chocolate",
      name: "Chocolate",
      order: 2,
      quantity: {
        period: 7,
        limit: 15,
        default: 0,
        unit: {
          type: "POSTFIX",
          label: "bar"
        }
      },
      identifiers: [
        {
          ...defaultIdentifier,
          label: "first"
        },
        {
          ...defaultIdentifier,
          label: "last"
        }
      ]
    }
  ],
  features: {
    REQUIRE_OTP: true,
    TRANSACTION_GROUPING: true,
    FLOW_TYPE: "DEFAULT",
    id: {
      type: "STRING",
      scannerType: "CODE_39",
      validation: "NRIC"
    }
  }
};

export const Wrapper: FunctionComponent<{
  products?: Policy[];
  features?: Features | undefined;
  allProducts?: Policy[];
}> = ({
  children,
  products = defaultProducts.policies,
  features = defaultProducts.features,
  allProducts = defaultProducts.policies
}) => {
  const getProduct = (category: string): Policy | undefined =>
    products?.find(product => product.category === category) ?? undefined;
  const getFeatures = (): Features | undefined => features;
  return (
    <ProductContext.Provider
      value={{
        products,
        features,
        allProducts,
        getProduct,
        setProducts: jest.fn(),
        getFeatures,
        setFeatures: jest.fn(),
        setAllProducts: jest.fn()
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
