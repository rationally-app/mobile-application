import { IS_MOCK } from "../../config";
import { Policy } from "../../types";

export interface AuthenticationResponse {
  policies: Policy[];
}

export const liveAuthenticate = async (
  key: string,
  endpoint: string
): Promise<AuthenticationResponse> => {
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
  _endpoint: string
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
        order: 1,
        default: true
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
