import React, { ReactElement, useEffect } from "react";
import { Text, View } from "react-native";
import { DbContextProvider, useDbContext } from "./db";
import { render } from "@testing-library/react-native";

const TestComponent = (): ReactElement => {
  const { db, setDb } = useDbContext();
  const mockDb = "MOCK_DB" as any;
  useEffect(() => {
    setDb!(mockDb);
  }, []);
  return <Text testID="printed-db">{db}</Text>;
};

const PassthroughParent = ({
  children
}: {
  children: ReactElement;
}): ReactElement => <View>{children}</View>;

const WrappedComponent = (): ReactElement => (
  <DbContextProvider>
    <PassthroughParent>
      <TestComponent />
    </PassthroughParent>
  </DbContextProvider>
);

describe("DbContextProvider", () => {
  it("should gives context to successors", async () => {
    expect.assertions(1);
    const { getByTestId } = render(<WrappedComponent />);
    expect(getByTestId("printed-db").props.children).toBe("MOCK_DB");
  });
});
