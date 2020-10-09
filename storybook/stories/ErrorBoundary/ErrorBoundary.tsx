import React from "react";
import { storiesOf } from "@storybook/react-native";
import { ErrorBoundaryContent } from "../../../src/components/ErrorBoundary/ErrorBoundaryContent";
import { formatDateTime } from "../../../src/utils/dateTimeFormatter";

storiesOf("ErrorBoundary", module).add("ErrorBoundary", () => (
  <ErrorBoundaryContent error={`(LoginError ${formatDateTime(Date.now())})`} />
));
