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
        ({ header, ...rest }: TransactionsGroup, index: number) => (
          <TransactionsGroup
            key={index}
            maxTransactionsToDisplay={BIG_NUMBER}
            {...rest}
          />
        )
      )}
    </>
  ) : null;
};
