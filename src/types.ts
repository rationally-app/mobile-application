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

const Policy = t.intersection([
  t.type({
    category: t.string,
    name: t.string,
    order: t.number,
    quantity: PolicyQuantity
  }),
  t.partial({
    description: t.string,
    image: t.string
  })
]);

export const Policies = t.type({
  policies: t.array(Policy)
});

export type Policy = t.TypeOf<typeof Policy>;
export type Policies = t.TypeOf<typeof Policies>;

const ItemQuota = t.intersection([
  t.type({
    category: t.string,
    quantity: t.number
  }),
  t.partial({
    transactionTime: DateFromNumber
  })
]);

export const Quota = t.type({
  remainingQuota: t.array(ItemQuota)
});

export type ItemQuota = t.TypeOf<typeof ItemQuota>;
export type Quota = t.TypeOf<typeof Quota>;

const Transaction = t.type({
  category: t.string,
  quantity: t.number
});

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
