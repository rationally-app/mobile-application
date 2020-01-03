import React, { FunctionComponent } from "react";
import { act } from "@testing-library/react-native";
import { DbContext } from "../../context/db";

export const mockSubscribe = jest.fn();
export const mockInsert = jest.fn();
export const mockSetDb = jest.fn();

const documents = {
  find: () => documents,
  findOne: () => documents,
  sort: () => documents,
  insert: mockInsert,
  $: {
    subscribe: mockSubscribe
  }
};
const mockDb: any = {
  documents
};

export const MockDbProvider: FunctionComponent = ({ children }) => (
  <DbContext.Provider value={{ db: mockDb, setDb: mockSetDb }}>
    {children}
  </DbContext.Provider>
);

export const whenDbSubscriptionReturns = (results: any): void => {
  const setFunction = mockSubscribe.mock.calls[0][0];
  act(() => setFunction(results));
};

export const resetDb = mockSubscribe.mockReset;
