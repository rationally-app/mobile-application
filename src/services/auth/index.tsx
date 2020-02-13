import { STAGING_ENDPOINT, PRODUCTION_ENDPOINT, IS_MOCK } from "../../config";
import { AppMode } from "../../common/hooks/useConfig";

export interface Policy {
  category: string;
  name: string;
  unit: string;
  quantityPerPeriod: number; // Not needed now
  period: number; // Not needed now
}

export interface Barcode {
  sku: string;
  name: string;
  category: string;
  unit: string; // May be redundant
  quantity: number;
}

export interface AuthenticationResponse {
  policy: Policy[];
  barcode: Barcode[];
}

export const liveAuthenticate = async (
  key: string,
  mode: AppMode
): Promise<AuthenticationResponse> => {
  const endpoint =
    mode === AppMode.production ? PRODUCTION_ENDPOINT : STAGING_ENDPOINT;
  const response: AuthenticationResponse = await fetch(`${endpoint}/auth`, {
    method: "GET",
    headers: {
      Authorization: key
    }
  }).then(res => res.json());
  return response;
};

export const mockAuthenticate = async (
  key: string,
  _mode: AppMode
): Promise<AuthenticationResponse> => {
  if (key != "CORRECT_KEY") throw new Error("Fail to authenticate");
  return {
    policy: [
      {
        category: "product-1",
        name: "Product 1",
        unit: "piece",
        quantityPerPeriod: 1,
        period: 604800
      },
      {
        category: "product-2",
        name: "Product 2",
        unit: "ml",
        quantityPerPeriod: 500,
        period: 604800
      }
    ],
    barcode: [
      {
        sku: "6001106119225",
        category: "product-x",
        unit: "ml",
        quantity: 200,
        name: "Dettol Hand Sanitiser 200ml"
      },
      {
        sku: "608912992255",
        category: "product-y",
        unit: "piece",
        quantity: 50,
        name: "Filter Mask - 50 Count 3-Ply Disposable Face Mask"
      }
    ]
  };
};

export const authenticate = IS_MOCK ? mockAuthenticate : liveAuthenticate;
