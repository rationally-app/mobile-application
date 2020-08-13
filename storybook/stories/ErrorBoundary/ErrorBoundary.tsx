import React from "react";
import { storiesOf } from "@storybook/react-native";
import { format } from "date-fns";
import { ErrorBoundaryContent } from "../../../src/components/ErrorBoundary/ErrorBoundaryContent";

storiesOf("ErrorBoundary", module).add("ErrorBoundary", () => (
  <ErrorBoundaryContent
    error={`(LoginError ${format(Date.now(), "hh:mma, d MMMM")})`}
  />
));
