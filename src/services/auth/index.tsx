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
        name: "🧻 Toilet Paper",
        description: "1 ply / 2 ply / 3 ply",
        order: 1,
        quantity: {
          period: 7,
          limit: 2,
          unit: {
            type: "POSTFIX",
            label: " pack(s)"
          }
        }
      },
      {
        category: "instant-noodles",
        name: "🍜 Instant Noodles",
        description: "Indomee",
        order: 2,
        quantity: {
          period: 30,
          limit: 1,
          unit: {
            type: "POSTFIX",
            label: " pack(s)"
          }
        }
      },
      {
        category: "chocolate",
        name: "🍫 Chocolate",
        description: "Dark / White / Assorted",
        order: 3,
        quantity: {
          period: 14,
          limit: 30,
          step: 5,
          unit: {
            type: "PREFIX",
            label: "$"
          }
        }
      }
    ]
  };
};

export const authenticate = IS_MOCK ? mockAuthenticate : liveAuthenticate;
