import { STAGING_ENDPOINT, PRODUCTION_ENDPOINT, IS_MOCK } from "../../config";
import { AppMode } from "../../context/config";

export interface Policy {
  category: string;
  name: string;
  unit: string;
  quantityLimit: number; // Not needed now
  period: number; // Not needed now
  order: number;
}

export interface AuthenticationResponse {
  policies: Policy[];
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
    policies: [
      {
        category: "toilet-paper",
        name: "Toilet Paper",
        period: 7,
        quantityLimit: 1000,
        unit: "piece",
        order: 1
      },
      {
        category: "instant-noodles",
        name: "Instant Noodles",
        period: 30,
        quantityLimit: 60,
        unit: "packs",
        order: 2
      },
      {
        category: "chocolate",
        name: "Chocolate",
        period: 14,
        quantityLimit: 1,
        unit: "grams",
        order: 3
      }
    ]
  };
};

export const authenticate = IS_MOCK ? mockAuthenticate : liveAuthenticate;
