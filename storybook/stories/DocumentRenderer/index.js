import React from "react";
import { storiesOf } from "@storybook/react-native";

import { DocumentRenderer } from "../../../src/components/DocumentRenderer/DocumentRenderer";
import demoOc from "./demo-oc.json";
import demoCaas from "./demo-caas.json";
import demoEbl from "./demo-ebl.json";

storiesOf("DocumentRenderer", module).add("OpenCerts", () => (
  <DocumentRenderer document={demoOc} />
));

storiesOf("DocumentRenderer", module).add("UALP", () => (
  <DocumentRenderer document={demoCaas} />
));

storiesOf("DocumentRenderer", module).add("eBL", () => (
  <DocumentRenderer document={demoEbl} />
));
