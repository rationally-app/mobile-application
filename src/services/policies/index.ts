import { IS_MOCK } from "../../config";
import { Policies } from "../../types";
import { fetchWithValidator, ValidationError } from "../helpers";
import * as Sentry from "sentry-expo";

export class PolicyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PolicyError";
  }
}

const liveGetPolicies = async (
  token: string,
  endpoint: string
): Promise<Policies> => {
  try {
    const response = await fetchWithValidator(Policies, `${endpoint}/auth`, {
      method: "GET",
      headers: {
        Authorization: token
      }
    });
    return response;
  } catch (e) {
    if (e instanceof ValidationError) {
      Sentry.captureException(e);
    }
    throw new PolicyError(e.message);
  }
};

const mockGetPolicies = async (
  _token: string,
  _endpoint: string
): Promise<Policies> => {
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
      },
      {
        category: "vouchers",
        name: "Vouchers",
        order: 4,
        quantity: { period: 1, limit: 1 },
        identifiers: [
          {
            label: "Voucher code",
            textInput: { visible: true, disabled: true, type: "STRING" },
            scanButton: {
              visible: true,
              disabled: false,
              type: "QR",
              text: "Scan"
            }
          }
        ]
      }
    ]
  };
};

export const getPolicies = IS_MOCK ? mockGetPolicies : liveGetPolicies;
