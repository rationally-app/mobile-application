import React, { FunctionComponent } from "react";
import { TransactionsGroup } from "../TransactionsGroup";

const BIG_NUMBER = 99999;

export const AddonsItems: FunctionComponent<{
  transactionList: TransactionsGroup[];
  isShowAddonItems: boolean;
}> = ({ transactionList, isShowAddonItems }) => {
  return isShowAddonItems && transactionList && transactionList.length > 0 ? (
    <>
      {transactionList.map(
        (
          { transactions, order }: Omit<TransactionsGroup, "header">,
          index: number
        ) => (
          <TransactionsGroup
            key={index}
            maxTransactionsToDisplay={BIG_NUMBER}
            transactions={transactions}
            order={order}
          />
        )
      )}
    </>
  ) : null;
};
