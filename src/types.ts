import * as t from "io-ts";
import { DateFromNumber } from "io-ts-types/lib/DateFromNumber";
import {
  NavigationParams,
  NavigationScreenProp,
  NavigationRoute
} from "react-navigation";

export interface NavigationProps {
  navigation: NavigationScreenProp<NavigationRoute, NavigationParams>;
}

export const SessionCredentials = t.type({
  sessionToken: t.string,
  ttl: DateFromNumber
});

export type SessionCredentials = t.TypeOf<typeof SessionCredentials>;

const PolicyQuantity = t.intersection([
  t.type({
    period: t.number,
    limit: t.number
  }),
  t.partial({
    default: t.number,
    step: t.number,
    unit: t.type({
      type: t.union([t.literal("PREFIX"), t.literal("POSTFIX")]),
      label: t.string
    })
  })
]);

const TextInputType = t.union([
  t.literal("STRING"),
  t.literal("NUMBER"),
  t.literal("PHONE_NUMBER")
]);

const ScanButtonType = t.union([t.literal("QR"), t.literal("BARCODE")]);

const PolicyIdentifier = t.intersection([
  t.type({
    label: t.string,
    textInput: t.intersection([
      t.type({
        visible: t.boolean,
        disabled: t.boolean
      }),
      t.partial({
        type: TextInputType
      })
    ]),
    scanButton: t.intersection([
      t.type({
        visible: t.boolean,
        disabled: t.boolean
      }),
      t.partial({
        type: ScanButtonType,
        text: t.string
      })
    ])
  }),
  t.partial({ validationRegex: t.string })
]);

const IdentifierInput = t.intersection([
  t.type({
    label: t.string,
    value: t.string
  }),
  t.partial({
    textInputType: TextInputType,
    scanButtonType: ScanButtonType,
    validationRegex: t.string
  })
]);

const Policy = t.intersection([
  t.type({
    category: t.string,
    name: t.string,
    order: t.number,
    quantity: PolicyQuantity
  }),
  t.partial({
    description: t.string,
    image: t.string,
    identifiers: t.array(PolicyIdentifier),
    type: t.union([t.literal("PURCHASE"), t.literal("REDEEM")])
  })
]);

const Features = t.type({
  REQUIRE_OTP: t.boolean,
  TRANSACTION_GROUPING: t.boolean,
  FLOW_TYPE: t.string
});

export const EnvVersion = t.type({
  policies: t.array(Policy),
  features: Features
});

export type TextInputType = t.TypeOf<typeof TextInputType>;
export type ScanButtonType = t.TypeOf<typeof ScanButtonType>;
export type IdentifierInput = t.TypeOf<typeof IdentifierInput>;
export type PolicyIdentifier = t.TypeOf<typeof PolicyIdentifier>;
export type Policy = t.TypeOf<typeof Policy>;
export type EnvVersion = t.TypeOf<typeof EnvVersion>;
export type Features = t.TypeOf<typeof Features>;

const ItemQuota = t.intersection([
  t.type({
    category: t.string,
    quantity: t.number
  }),
  t.partial({
    transactionTime: DateFromNumber,
    identifierInputs: t.array(IdentifierInput)
  })
]);

export const Quota = t.type({
  remainingQuota: t.array(ItemQuota)
});

export type ItemQuota = t.TypeOf<typeof ItemQuota>;
export type Quota = t.TypeOf<typeof Quota>;

const Transaction = t.intersection([
  t.type({
    category: t.string,
    quantity: t.number
  }),
  t.partial({ identifierInputs: t.array(IdentifierInput) })
]);

export const PostTransactionResult = t.type({
  transactions: t.array(
    t.type({
      transaction: t.array(Transaction),
      timestamp: DateFromNumber
    })
  )
});

export type Transaction = t.TypeOf<typeof Transaction>;
export type PostTransactionResult = t.TypeOf<typeof PostTransactionResult>;
