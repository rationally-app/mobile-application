import { IS_MOCK } from "../../config";
import { EnvVersion } from "../../types";
import { fetchWithValidator, ValidationError } from "../helpers";
import * as Sentry from "sentry-expo";

export class EnvVersionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EnvVersionError";
  }
}

const liveGetEnvVersion = async (
  token: string,
  endpoint: string
): Promise<EnvVersion> => {
  try {
    const response = await fetchWithValidator(
      EnvVersion,
      `${endpoint}/version`,
      {
        method: "GET",
        headers: {
          Authorization: token
        }
      }
    );
    return response;
  } catch (e) {
    if (e instanceof ValidationError) {
      Sentry.captureException(e);
    }
    throw new EnvVersionError(e.message);
  }
};

const mockGetEnvVersion = async (
  _token: string,
  _endpoint: string
): Promise<EnvVersion> => {
  return {
    policies: [
      {
        category: "toilet-paper",
        name: "🧻 Toilet Paper",
        description: "1 ply / 2 ply / 3 ply",
        order: 1,
        type: "REDEEM",
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
        type: "REDEEM",
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
        type: "REDEEM",
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
        name: "Funfair Vouchers",
        order: 4,
        type: "REDEEM",
        quantity: { period: 1, limit: 1, default: 1 },
        identifiers: [
          {
            label: "Voucher",
            textInput: { visible: true, disabled: false, type: "STRING" },
            scanButton: {
              visible: true,
              disabled: false,
              type: "BARCODE",
              text: "Scan"
            }
          },
          {
            label: "Token",
            textInput: { visible: true, disabled: true, type: "STRING" },
            scanButton: {
              visible: true,
              disabled: false,
              type: "QR",
              text: "Scan"
            }
          }
        ]
      },
      {
        category: "voucher",
        name: "🎟️ Golden Ticket",
        order: 5,
        type: "REDEEM",
        quantity: { period: 1, limit: 1, default: 1 },
        identifiers: [
          {
            label: "Phone number",
            textInput: { visible: true, disabled: true, type: "PHONE_NUMBER" },
            scanButton: {
              visible: false,
              disabled: false
            }
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
};

export const getEnvVersion = IS_MOCK ? mockGetEnvVersion : liveGetEnvVersion;
