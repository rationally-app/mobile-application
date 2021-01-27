import { IS_MOCK } from "../../config";
import { CampaignConfig, ConfigHashes } from "../../types";
import { fetchWithValidator, ValidationError, SessionError } from "../helpers";
import { Sentry } from "../../utils/errorTracking";
import i18n from "i18n-js";

export class CampaignConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CampaignConfigError";
  }
}

const liveGetCampaignConfig = async (
  token: string,
  endpoint: string,
  configHashes?: ConfigHashes
): Promise<CampaignConfig> => {
  try {
    return await fetchWithValidator(
      CampaignConfig,
      `${endpoint}/client-config`,
      {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: JSON.stringify({
          ...configHashes,
          language: i18n.locale.startsWith("zh") ? "zh" : "en",
        }),
      }
    );
  } catch (e) {
    if (e instanceof ValidationError) {
      Sentry.captureException(e);
    } else if (e instanceof SessionError) {
      throw e;
    }
    throw new CampaignConfigError(e.message);
  }
};

const mockGetCampaignConfig = async (
  _token: string,
  _endpoint: string,
  configHashes?: ConfigHashes
): Promise<CampaignConfig> => {
  return {
    features: {
      minAppBinaryVersion: "3.0.0",
      minAppBuildVersion: 0,
      campaignName: "Test campaign",
      transactionGrouping: true,
      flowType: "DEFAULT",
      id: {
        type: "STRING",
        scannerType: "CODE_39",
        validation: "NRIC",
      },
    },
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
            label: " pack(s)",
          },
        },
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
            label: " pack(s)",
          },
        },
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
            label: "$",
          },
        },
      },
      {
        category: "vouchers",
        name: "Funfair Vouchers",
        order: 4,
        quantity: { period: 1, limit: 1, default: 1 },
        identifiers: [
          {
            label: "Voucher",
            textInput: { visible: true, disabled: false, type: "STRING" },
            scanButton: {
              visible: true,
              disabled: false,
              type: "BARCODE",
              text: "Scan",
            },
          },
          {
            label: "Token",
            textInput: { visible: true, disabled: true, type: "STRING" },
            scanButton: {
              visible: true,
              disabled: false,
              type: "QR",
              text: "Scan",
            },
          },
        ],
      },
      {
        category: "voucher",
        name: "🎟️ Golden Ticket",
        order: 5,
        quantity: { period: 1, limit: 1, default: 1 },
        identifiers: [
          {
            label: "Phone number",
            textInput: { visible: true, disabled: true, type: "PHONE_NUMBER" },
            scanButton: {
              visible: false,
              disabled: false,
            },
          },
        ],
      },
    ],
    c13n: {},
  };
};

export const getCampaignConfig = IS_MOCK
  ? mockGetCampaignConfig
  : liveGetCampaignConfig;
