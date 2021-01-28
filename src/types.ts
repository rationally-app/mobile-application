import * as t from "io-ts";
import { DateFromNumber } from "io-ts-types/lib/DateFromNumber";
import { NavigationParams, NavigationRoute } from "react-navigation";
import { NavigationDrawerProp } from "react-navigation-drawer";

export interface NavigationProps {
  navigation: NavigationDrawerProp<NavigationRoute, NavigationParams>;
}

export type AuthCredentials = {
  operatorToken: string;
  sessionToken: string;
  endpoint: string;
  expiry: number;
};

export const SessionCredentials = t.type({
  sessionToken: t.string,
  ttl: DateFromNumber,
});

export const OTPResponse = t.intersection([
  t.type({
    status: t.string,
  }),
  t.partial({
    warning: t.string,
  }),
]);

export type SessionCredentials = t.TypeOf<typeof SessionCredentials>;
export type OTPResponse = t.TypeOf<typeof OTPResponse>;

const PolicyAlert = t.type({
  threshold: t.number,
  label: t.string,
});

const PolicyQuantity = t.intersection([
  t.type({
    period: t.number,
    limit: t.number,
  }),
  t.partial({
    periodType: t.union([t.literal("ROLLING"), t.literal("CRON")]),
    periodExpression: t.union([t.number, t.string]),
    default: t.number,
    step: t.number,
    unit: t.type({
      type: t.union([t.literal("PREFIX"), t.literal("POSTFIX")]),
      label: t.string,
    }),
    checkoutLimit: t.number,
    usage: t.type({
      periodType: t.union([t.literal("ROLLING"), t.literal("CRON")]),
      periodExpression: t.union([t.number, t.string]),
      limit: t.number,
    }),
  }),
]);

const TextInputType = t.union([
  t.literal("STRING"),
  t.literal("NUMBER"),
  t.literal("PHONE_NUMBER"),
]);

const ScanButtonType = t.union([t.literal("QR"), t.literal("BARCODE")]);

const PolicyIdentifier = t.intersection([
  t.type({
    label: t.string,
    textInput: t.intersection([
      t.type({
        visible: t.boolean,
        disabled: t.boolean,
      }),
      t.partial({
        type: TextInputType,
      }),
    ]),
    scanButton: t.intersection([
      t.type({
        visible: t.boolean,
        disabled: t.boolean,
      }),
      t.partial({
        type: ScanButtonType,
        text: t.string,
      }),
    ]),
  }),
  t.partial({ validationRegex: t.string }),
]);

const IdentifierInput = t.intersection([
  t.type({
    label: t.string,
    value: t.string,
  }),
  t.partial({
    textInputType: TextInputType,
    scanButtonType: ScanButtonType,
    validationRegex: t.string,
  }),
]);

const CategoryType = t.union([t.literal("DEFAULT"), t.literal("APPEAL")]);

const CampaignPolicy = t.intersection([
  t.type({
    category: t.string,
    name: t.string,
    order: t.number,
    quantity: PolicyQuantity,
  }),
  t.partial({
    categoryType: CategoryType,
    description: t.string,
    image: t.string,
    identifiers: t.array(PolicyIdentifier),
    alert: PolicyAlert,
  }),
]);

const IdentificationFlag = t.intersection([
  t.type({
    type: t.union([t.literal("STRING"), t.literal("NUMBER")]),
    scannerType: t.union([
      t.literal("CODE_39"),
      t.literal("QR"),
      t.literal("NONE"),
    ]),
    validation: t.union([
      t.literal("NRIC"),
      t.literal("PASSPORT"),
      t.literal("REGEX"),
      t.literal("UIN"),
      t.literal("EMAIL"),
    ]),
  }),
  t.partial({
    label: t.string,
    validationRegex: t.string,
  }),
]);

const CampaignFeatures = t.intersection([
  t.type({
    minAppBinaryVersion: t.string,
    minAppBuildVersion: t.number,
    campaignName: t.string,
    transactionGrouping: t.boolean,
    flowType: t.string,
    id: IdentificationFlag,
  }),
  t.partial({
    alternateIds: t.array(IdentificationFlag),
  }),
]);

export const CampaignC13N = t.record(t.string, t.string);

export const CampaignConfig = t.type({
  features: t.union([CampaignFeatures, t.null]),
  policies: t.union([t.array(CampaignPolicy), t.null]),
  c13n: t.union([CampaignC13N, t.null]),
});

export type TextInputType = t.TypeOf<typeof TextInputType>;
export type ScanButtonType = t.TypeOf<typeof ScanButtonType>;
export type CategoryType = t.TypeOf<typeof CategoryType>;
export type IdentifierInput = t.TypeOf<typeof IdentifierInput>;
export type IdentificationFlag = t.TypeOf<typeof IdentificationFlag>;
export type PolicyIdentifier = t.TypeOf<typeof PolicyIdentifier>;
export type CampaignPolicy = t.TypeOf<typeof CampaignPolicy>;
export type CampaignFeatures = t.TypeOf<typeof CampaignFeatures>;
export type CampaignC13N = t.TypeOf<typeof CampaignC13N>;
export type CampaignConfig = t.TypeOf<typeof CampaignConfig>;
export type ConfigHashes = {
  [config in keyof CampaignConfig]: string | undefined;
};

const ItemQuota = t.intersection([
  t.type({
    category: t.string,
    quantity: t.number,
  }),
  t.partial({
    quotaRefreshTime: t.number,
    transactionTime: DateFromNumber,
  }),
]);

export const Quota = t.type({
  remainingQuota: t.array(ItemQuota),
  localQuota: t.array(ItemQuota),
  globalQuota: t.array(ItemQuota),
});

export type ItemQuota = t.TypeOf<typeof ItemQuota>;
export type Quota = t.TypeOf<typeof Quota>;

const Transaction = t.intersection([
  t.type({
    category: t.string,
    quantity: t.number,
  }),
  t.partial({ identifierInputs: t.array(IdentifierInput) }),
]);

export const PostTransactionResult = t.type({
  transactions: t.array(
    t.type({
      transaction: t.array(Transaction),
      timestamp: DateFromNumber,
    })
  ),
});

export type Transaction = t.TypeOf<typeof Transaction>;
export type PostTransactionResult = t.TypeOf<typeof PostTransactionResult>;

const PastTransaction = t.intersection([
  t.type({
    category: t.string,
    quantity: t.number,
    transactionTime: DateFromNumber,
  }),
  t.partial({ identifierInputs: t.array(IdentifierInput) }),
]);
export const PastTransactionsResult = t.type({
  pastTransactions: t.array(PastTransaction),
});

export type PastTransactionsResult = t.TypeOf<typeof PastTransactionsResult>;

export type Voucher = {
  serial: string;
  denomination: number;
};

const DailyStatistics = t.intersection([
  t.type({
    category: t.string,
    quantity: t.number,
    transactionTime: DateFromNumber,
  }),
  t.partial({
    identifierInputs: t.array(IdentifierInput),
  }),
]);

export const DailyStatisticsResult = t.type({
  pastTransactions: t.array(DailyStatistics),
});

export type DailyStatistics = t.TypeOf<typeof DailyStatistics>;
export type DailyStatisticsResult = t.TypeOf<typeof DailyStatisticsResult>;
