import React from "react";
import { render } from "@testing-library/react-native";
import { DocumentMetadata } from "./DocumentMetadata";

describe("DocumentMetadata", () => {
  it("should show the document creation date", () => {
    expect.assertions(2);
    const document = {
      created: new Date(2020, 0, 1).getTime(),
      verified: new Date(2020, 0, 2).getTime()
    };

    const { queryByText } = render(<DocumentMetadata document={document} />);
    expect(queryByText("Date added")).not.toBeNull();
    expect(queryByText(new Date(2020, 0, 1).toLocaleString())).not.toBeNull();
  });

  it("should show the latest verification date if it exists", () => {
    expect.assertions(2);
    const document = {
      created: new Date(2020, 0, 1).getTime(),
      verified: new Date(2020, 0, 2).getTime()
    };

    const { queryByText } = render(<DocumentMetadata document={document} />);
    expect(queryByText("Date last verified")).not.toBeNull();
    expect(queryByText(new Date(2020, 0, 2).toLocaleString())).not.toBeNull();
  });

  it("should show a dash if the latest verification date does not exist", () => {
    expect.assertions(2);
    const document = {
      created: new Date(2020, 0, 1).getTime()
    };

    const { queryByText } = render(<DocumentMetadata document={document} />);
    const dateLastVerifiedTitle = queryByText("Date last verified");
    expect(dateLastVerifiedTitle).not.toBeNull();
    const dateLastVerifiedContent =
      dateLastVerifiedTitle?.parentNode.children[1];
    expect(dateLastVerifiedContent).toHaveTextContent("-");
  });
});
