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
        category: "item-a",
        name: "Item A",
        period: 10,
        quantityLimit: 1000,
        unit: "item",
        order: 1,
        default: true
      },
      {
        category: "item-b",
        name: "Item B",
        period: 30,
        quantityLimit: 60,
        unit: "item",
        order: 2
      },
      {
        category: "item-c",
        name: "Item C",
        period: 20,
        quantityLimit: 1,
        unit: "item",
        order: 3
      }
    ]
  };
};

export const getPolicies = IS_MOCK ? mockGetPolicies : liveGetPolicies;
