import * as t from "io-ts";
import { DateFromNumber } from "io-ts-types/lib/DateFromNumber";
import {
  DrawerNavigationProp,
  DrawerScreenProps,
} from "@react-navigation/drawer";
import {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";

export type RootDrawerParamList = {
  CampaignLocationsScreen: {
    shouldAutoLoad: boolean;
  };
  CustomerQuotaStack: CustomerQuotaStackParamList;
  MerchantPayoutStack: MerchantPayoutStackParamList;
};

export type RootStackParamList = {
  CampaignInitialisationScreen: {
    authCredentials: AuthCredentials;
  };
  LoginScreen: undefined;
  DrawerNavigator: NavigatorScreenParams<RootDrawerParamList>;
  LogoutScreen: undefined;
};

export type MerchantPayoutStackParamList = {
  MerchantPayoutScreen: {
    operatorToken: string;
    endpoint: string;
  };
  PayoutFeedbackScreen: {
    checkoutResult: PostTransactionResult;
    merchantCode: string;
  };
};

export type CustomerQuotaStackParamList = {
  CollectCustomerDetailsScreen: undefined;
  CustomerQuotaProxy: {
    operatorToken: string;
    endpoint: string;
    id: string;
    products: CampaignPolicy[];
  };
  CustomerQuotaScreen: {
    navIds: string[];
  };
  CustomerAppealScreen: {
    ids: string[];
  };
  DailyStatisticsScreen: undefined;
};

export type DrawerNavigationProps = CompositeScreenProps<
  DrawerScreenProps<RootDrawerParamList>,
  StackScreenProps<RootStackParamList>
>;

export type CustomerQuotaStackNavigationProp = CompositeNavigationProp<
  StackNavigationProp<
    CustomerQuotaStackParamList,
    keyof CustomerQuotaStackParamList
  >,
  CompositeNavigationProp<
    DrawerNavigationProp<RootDrawerParamList>,
    StackNavigationProp<RootStackParamList>
  >
>;

export type CollectCustomerDetailsScreenNavigationProps = CompositeScreenProps<
  StackScreenProps<CustomerQuotaStackParamList, "CollectCustomerDetailsScreen">,
  CompositeScreenProps<
    DrawerScreenProps<RootDrawerParamList>,
    StackScreenProps<RootStackParamList>
  >
>;

export type CustomerQuotaProxyNavigationProps = CompositeScreenProps<
  StackScreenProps<CustomerQuotaStackParamList, "CustomerQuotaProxy">,
  CompositeScreenProps<
    DrawerScreenProps<RootDrawerParamList>,
    StackScreenProps<RootStackParamList>
  >
>;

export type CustomerQuotaScreenNavigationProps = CompositeScreenProps<
  | StackScreenProps<CustomerQuotaStackParamList, "CustomerQuotaScreen">
  | StackScreenProps<CustomerQuotaStackParamList, "CustomerQuotaProxy">,
  CompositeScreenProps<
    DrawerScreenProps<RootDrawerParamList>,
    StackScreenProps<RootStackParamList>
  >
>;

export type CustomerAppealScreenNavigationProps = CompositeScreenProps<
  StackScreenProps<CustomerQuotaStackParamList, "CustomerAppealScreen">,
  CompositeScreenProps<
    DrawerScreenProps<RootDrawerParamList>,
    StackScreenProps<RootStackParamList>
  >
>;

export type DailyStatisticsScreenProps = CompositeScreenProps<
  StackScreenProps<CustomerQuotaStackParamList, "DailyStatisticsScreen">,
  CompositeScreenProps<
    DrawerScreenProps<RootDrawerParamList>,
    StackScreenProps<RootStackParamList>
  >
>;

//
export type AuthCredentials = {
  operatorToken: string;
  endpoint: string;
  sessionToken: string;
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

export const LogoutResponse = t.type({
  status: t.literal("OK"),
});

export type SessionCredentials = t.TypeOf<typeof SessionCredentials>;
export type OTPResponse = t.TypeOf<typeof OTPResponse>;

const PolicyAlert = t.type({
  threshold: t.union([t.number, t.string]),
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

const PolicyChoices = t.intersection([
  t.type({
    value: t.string,
  }),
  t.partial({
    label: t.string,
    tag: t.boolean,
  }),
]);

const TextInputType = t.union([
  t.literal("STRING"),
  t.literal("NUMBER"),
  t.literal("PHONE_NUMBER"),
  t.literal("PAYMENT_RECEIPT"),
  t.literal("SINGLE_CHOICE"),
  t.literal("PAYMENT_QR"),
]);

const ScanButtonType = t.union([
  t.literal("QR"),
  t.literal("BARCODE"),
  t.literal("CODE_128"),
  t.literal("CODE_39"),
]);

const ValidationType = t.union([
  t.literal("NRIC"),
  t.literal("PASSPORT"),
  t.literal("REGEX"),
  t.literal("UIN"),
  t.literal("EMAIL"),
]);

const PolicyIdentifier = t.intersection([
  t.type({
    label: t.string,
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
    textInput: t.intersection([
      t.type({
        disabled: t.boolean,
        visible: t.boolean,
      }),
      t.partial({
        choices: t.array(PolicyChoices),
        type: TextInputType,
      }),
    ]),
  }),
  t.partial({
    isOptional: t.boolean,
    validationRegex: t.string,
  }),
]);

export const IdentifierInput = t.intersection([
  t.type({
    label: t.string,
    value: t.string,
  }),
  t.partial({
    textInputType: TextInputType,
    scanButtonType: ScanButtonType,
    validationRegex: t.string,
    isOptional: t.boolean,
    isTextInputDisabled: t.boolean,
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
    validation: ValidationType,
  }),
  t.partial({
    label: t.string,
    validationRegex: t.string,
  }),
]);

const CampaignFeatures = t.intersection([
  t.type({
    campaignName: t.string,
    id: IdentificationFlag,
    minAppBinaryVersion: t.string,
    minAppBuildVersion: t.number,
  }),
  t.partial({
    alternateIds: t.array(IdentificationFlag),
    apiVersion: t.union([t.literal("v1"), t.literal("v2")]),
    flowType: t.string,
    theme: t.union([t.literal("DEFAULT"), t.literal("GOVWALLET")]),
    transactionGrouping: t.boolean,
    isPayNowTransaction: t.boolean,
    govwalletExactBalanceValue: t.number,
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
export type ValidationType = t.TypeOf<typeof ValidationType>;
export type CategoryType = t.TypeOf<typeof CategoryType>;
export type IdentifierInput = t.TypeOf<typeof IdentifierInput>;
export type IdentificationFlag = t.TypeOf<typeof IdentificationFlag>;
export type PolicyIdentifier = t.TypeOf<typeof PolicyIdentifier>;
export type PolicyChoices = t.TypeOf<typeof PolicyChoices>;
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

/**
 * GovWallet response types used for response validation
 */

export const GovWalletAccountDetail = t.type({
  accountId: t.string,
  created: t.string,
  modified: t.string,
  entity: t.string,
  accountType: t.string,
  category: t.string,
  campaign: t.string,
  activationStatus: t.string,
  balance: t.number,
});

export type GovWalletAccountDetail = t.TypeOf<typeof GovWalletAccountDetail>;

export const GovWalletBalance = t.type({
  customerId: t.string,
  accountDetails: t.array(GovWalletAccountDetail),
});

export type GovWalletBalance = t.TypeOf<typeof GovWalletBalance>;
