import { Policy } from "../../types";
import { IS_MOCK } from "../../config";

interface GetPoliciesResponse {
  policies: Policy[];
}

const liveGetPolicies = async (
  token: string,
  endpoint: string
): Promise<GetPoliciesResponse> => {
  const response = await fetch(`${endpoint}/auth`, {
    method: "GET",
    headers: {
      Authorization: token
    }
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
    return response.json().then(error => {
      throw new Error(error.message);
    });
  });
  return response;
};

const mockGetPolicies = async (
  _token: string,
  _endpoint: string
): Promise<GetPoliciesResponse> => {
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

export const getPolicies = IS_MOCK ? mockGetPolicies : liveGetPolicies;
