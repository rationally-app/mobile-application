import React, { useState, useEffect, FunctionComponent, useRef } from "react";
import { storiesOf } from "@storybook/react-native";
import { CenterDecorator } from "../decorators";
import { ValidityBanner } from "../../../src/components/DocumentRenderer/ValidityBanner";
import { View, Button, Text } from "react-native";
import { SignedDocument } from "@govtechsg/open-attestation";
import sampleDoc from "../../../fixtures/demo-oc.json";
import { CheckStatus } from "../../../src/constants/verifier";
import { useDocumentVerifier } from "../../../src/common/hooks/useDocumentVerifier";

const ValidChecksStory: FunctionComponent = () => {
  const [tamperedCheck, setTamperedCheck] = useState(CheckStatus.CHECKING);
  const [issuedCheck, setIssuedCheck] = useState(CheckStatus.CHECKING);
  const [revokedCheck, setRevokedCheck] = useState(CheckStatus.CHECKING);
  const [issuerCheck, setIssuerCheck] = useState(CheckStatus.CHECKING);
  const [overallValidity, setOverallValidity] = useState(CheckStatus.CHECKING);

  const [progress, setProgress] = useState<"stopped" | "started">("stopped");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const start = (): void => {
    timers.current.push(
      setTimeout(() => {
        setTamperedCheck(CheckStatus.VALID);
      }, 1000)
    );
    timers.current.push(
      setTimeout(() => {
        setIssuedCheck(CheckStatus.VALID);
      }, 2300)
    );
    timers.current.push(
      setTimeout(() => {
        setRevokedCheck(CheckStatus.VALID);
      }, 1500)
    );
    timers.current.push(
      setTimeout(() => {
        setIssuerCheck(CheckStatus.VALID);
      }, 2600)
    );
    timers.current.push(
      setTimeout(() => {
        setOverallValidity(CheckStatus.VALID);
      }, 2600)
    );
  };

  const reset = (): void => {
    setTamperedCheck(CheckStatus.CHECKING);
    setIssuedCheck(CheckStatus.CHECKING);
    setRevokedCheck(CheckStatus.CHECKING);
    setIssuerCheck(CheckStatus.CHECKING);
    setOverallValidity(CheckStatus.CHECKING);
  };

  useEffect(() => {
    const timersCopy: ReturnType<typeof setTimeout>[] = timers.current;
    timersCopy.forEach(timer => clearTimeout(timer));
    if (progress === "stopped") {
      reset();
    } else if (progress === "started") {
      start();
    }

    return () => {
      timersCopy.forEach(timer => clearTimeout(timer));
    };
  }, [progress]);

  return (
    <View style={{ width: "100%" }}>
      <ValidityBanner
        tamperedCheck={tamperedCheck}
        issuedCheck={issuedCheck}
        revokedCheck={revokedCheck}
        issuerCheck={issuerCheck}
        overallValidity={overallValidity}
      />
      <View
        style={{
          flexDirection: "row",
          marginTop: 8,
          justifyContent: "space-between",
          alignSelf: "center",
          width: "40%"
        }}
      >
        <Button title="Start" onPress={() => setProgress("started")} />
        <Button title="Reset" onPress={() => setProgress("stopped")} />
      </View>
      <Text style={{ marginTop: 8, alignSelf: "center" }}>{progress}</Text>
    </View>
  );
};

const InvalidChecksStory: FunctionComponent = () => {
  const [tamperedCheck, setTamperedCheck] = useState(CheckStatus.CHECKING);
  const [issuedCheck, setIssuedCheck] = useState(CheckStatus.CHECKING);
  const [revokedCheck, setRevokedCheck] = useState(CheckStatus.CHECKING);
  const [issuerCheck, setIssuerCheck] = useState(CheckStatus.CHECKING);
  const [overallValidity, setOverallValidity] = useState(CheckStatus.CHECKING);

  const [progress, setProgress] = useState<"stopped" | "started">("stopped");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const start = (): void => {
    timers.current.push(
      setTimeout(() => {
        setTamperedCheck(CheckStatus.VALID);
      }, 1000)
    );
    timers.current.push(
      setTimeout(() => {
        setIssuedCheck(CheckStatus.INVALID);
      }, 2600)
    );
    timers.current.push(
      setTimeout(() => {
        setRevokedCheck(CheckStatus.INVALID);
      }, 2300)
    );
    timers.current.push(
      setTimeout(() => {
        setIssuerCheck(CheckStatus.VALID);
      }, 1500)
    );
    timers.current.push(
      setTimeout(() => {
        setOverallValidity(CheckStatus.INVALID);
      }, 2600)
    );
  };

  const reset = (): void => {
    setTamperedCheck(CheckStatus.CHECKING);
    setIssuedCheck(CheckStatus.CHECKING);
    setRevokedCheck(CheckStatus.CHECKING);
    setIssuerCheck(CheckStatus.CHECKING);
    setOverallValidity(CheckStatus.CHECKING);
  };

  useEffect(() => {
    const timersCopy: ReturnType<typeof setTimeout>[] = timers.current;
    timersCopy.forEach(timer => clearTimeout(timer));
    if (progress === "stopped") {
      reset();
    } else if (progress === "started") {
      start();
    }

    return () => {
      timersCopy.forEach(timer => clearTimeout(timer));
    };
  }, [progress]);

  return (
    <View style={{ width: "100%" }}>
      <ValidityBanner
        tamperedCheck={tamperedCheck}
        issuedCheck={issuedCheck}
        revokedCheck={revokedCheck}
        issuerCheck={issuerCheck}
        overallValidity={overallValidity}
      />
      <View
        style={{
          flexDirection: "row",
          marginTop: 8,
          justifyContent: "space-between",
          alignSelf: "center",
          width: "40%"
        }}
      >
        <Button title="Start" onPress={() => setProgress("started")} />
        <Button title="Reset" onPress={() => setProgress("stopped")} />
      </View>
      <Text style={{ marginTop: 8, alignSelf: "center" }}>{progress}</Text>
    </View>
  );
};

const ActualChecksStory: FunctionComponent = () => {
  const {
    tamperedCheck,
    issuedCheck,
    revokedCheck,
    issuerCheck,
    overallValidity
  } = useDocumentVerifier(sampleDoc as SignedDocument);

  return (
    <View style={{ width: "100%" }}>
      <ValidityBanner
        tamperedCheck={tamperedCheck}
        issuedCheck={issuedCheck}
        revokedCheck={revokedCheck}
        issuerCheck={issuerCheck}
        overallValidity={overallValidity}
      />
    </View>
  );
};

storiesOf("ValidityBanner", module)
  .addDecorator(CenterDecorator)
  .add("Variants", () => (
    <View
      style={{
        width: "100%",
        justifyContent: "space-between"
      }}
    >
      <ValidityBanner
        tamperedCheck={CheckStatus.CHECKING}
        issuedCheck={CheckStatus.CHECKING}
        revokedCheck={CheckStatus.CHECKING}
        issuerCheck={CheckStatus.CHECKING}
        overallValidity={CheckStatus.CHECKING}
      />
      <ValidityBanner
        tamperedCheck={CheckStatus.CHECKING}
        issuedCheck={CheckStatus.CHECKING}
        revokedCheck={CheckStatus.CHECKING}
        issuerCheck={CheckStatus.VALID}
        overallValidity={CheckStatus.CHECKING}
      />
      <ValidityBanner
        tamperedCheck={CheckStatus.INVALID}
        issuedCheck={CheckStatus.CHECKING}
        revokedCheck={CheckStatus.CHECKING}
        issuerCheck={CheckStatus.VALID}
        overallValidity={CheckStatus.INVALID}
      />
      <ValidityBanner
        tamperedCheck={CheckStatus.VALID}
        issuedCheck={CheckStatus.VALID}
        revokedCheck={CheckStatus.VALID}
        issuerCheck={CheckStatus.VALID}
        overallValidity={CheckStatus.VALID}
      />
    </View>
  ));

storiesOf("ValidityBanner/Flows", module)
  .addDecorator(CenterDecorator)
  .add("Valid flow", () => <ValidChecksStory />)
  .add("Invalid flow", () => <InvalidChecksStory />)
  .add("Actual flow", () => <ActualChecksStory />);
