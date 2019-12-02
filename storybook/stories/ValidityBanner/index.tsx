import React, { useState, useEffect, FunctionComponent, useRef } from "react";
import { storiesOf } from "@storybook/react-native";
import { CenterDecorator } from "../decorators";
import {
  ValidityBanner,
  CheckStatus
} from "../../../src/components/DocumentRenderer/ValidityBanner";
import { View, Button, Text } from "react-native";
import { SignedDocument } from "@govtechsg/open-attestation";
import { checkValidity } from "../../../src/services/DocumentVerifier";
import sampleDoc from "../../../fixtures/demo-oc.json";

const ValidChecksStory: FunctionComponent = () => {
  const [tamperedCheck, setTamperedCheck] = useState<CheckStatus>("checking");
  const [issuedCheck, setIssuedCheck] = useState<CheckStatus>("checking");
  const [revokedCheck, setRevokedCheck] = useState<CheckStatus>("checking");
  const [issuerCheck, setIssuerCheck] = useState<CheckStatus>("checking");

  const [progress, setProgress] = useState<"stopped" | "started">("stopped");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const start = (): void => {
    timers.current.push(
      setTimeout(() => {
        setTamperedCheck("valid");
      }, 1000)
    );
    timers.current.push(
      setTimeout(() => {
        setIssuedCheck("valid");
      }, 2300)
    );
    timers.current.push(
      setTimeout(() => {
        setRevokedCheck("valid");
      }, 1500)
    );
    timers.current.push(
      setTimeout(() => {
        setIssuerCheck("valid");
      }, 2600)
    );
  };

  const reset = (): void => {
    setTamperedCheck("checking");
    setIssuedCheck("checking");
    setRevokedCheck("checking");
    setIssuerCheck("checking");
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
  const [tamperedCheck, setTamperedCheck] = useState<CheckStatus>("checking");
  const [issuedCheck, setIssuedCheck] = useState<CheckStatus>("checking");
  const [revokedCheck, setRevokedCheck] = useState<CheckStatus>("checking");
  const [issuerCheck, setIssuerCheck] = useState<CheckStatus>("checking");

  const [progress, setProgress] = useState<"stopped" | "started">("stopped");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const start = (): void => {
    timers.current.push(
      setTimeout(() => {
        setTamperedCheck("valid");
      }, 1000)
    );
    timers.current.push(
      setTimeout(() => {
        setIssuedCheck("invalid");
      }, 2600)
    );
    timers.current.push(
      setTimeout(() => {
        setRevokedCheck("invalid");
      }, 2300)
    );
    timers.current.push(
      setTimeout(() => {
        setIssuerCheck("valid");
      }, 1500)
    );
  };

  const reset = (): void => {
    setTamperedCheck("checking");
    setIssuedCheck("checking");
    setRevokedCheck("checking");
    setIssuerCheck("checking");
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
  const [tamperedCheck, setTamperedCheck] = useState<CheckStatus>("checking");
  const [issuedCheck, setIssuedCheck] = useState<CheckStatus>("checking");
  const [revokedCheck, setRevokedCheck] = useState<CheckStatus>("checking");
  const [issuerCheck, setIssuerCheck] = useState<CheckStatus>("checking");

  const start = (): void => {
    const [verifyHashIssuedRevoked, verifyIdentity] = checkValidity(
      sampleDoc as SignedDocument
    );

    verifyHashIssuedRevoked.then(v => {
      setTamperedCheck(v.hash.checksumMatch ? "valid" : "invalid");
      setIssuedCheck(v.issued.issuedOnAll ? "valid" : "invalid");
      setRevokedCheck(v.revoked.revokedOnAny ? "invalid" : "valid");
    });

    verifyIdentity.then(v => {
      setIssuerCheck(v.identifiedOnAll ? "valid" : "invalid");
    });
  };

  const reset = (): void => {
    setTamperedCheck("checking");
    setIssuedCheck("checking");
    setRevokedCheck("checking");
    setIssuerCheck("checking");
  };

  return (
    <View style={{ width: "100%" }}>
      <ValidityBanner
        tamperedCheck={tamperedCheck}
        issuedCheck={issuedCheck}
        revokedCheck={revokedCheck}
        issuerCheck={issuerCheck}
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
        <Button title="Start" onPress={start} />
        <Button title="Reset" onPress={reset} />
      </View>
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
        tamperedCheck="checking"
        issuedCheck="checking"
        revokedCheck="checking"
        issuerCheck="checking"
      />
      <ValidityBanner
        tamperedCheck="checking"
        issuedCheck="checking"
        revokedCheck="checking"
        issuerCheck="valid"
      />
      <ValidityBanner
        tamperedCheck="invalid"
        issuedCheck="checking"
        revokedCheck="checking"
        issuerCheck="valid"
      />
      <ValidityBanner
        tamperedCheck="valid"
        issuedCheck="valid"
        revokedCheck="valid"
        issuerCheck="valid"
      />
    </View>
  ));

storiesOf("ValidityBanner/Flows", module)
  .addDecorator(CenterDecorator)
  .add("Valid flow", () => <ValidChecksStory />)
  .add("Invalid flow", () => <InvalidChecksStory />)
  .add("Actual flow", () => <ActualChecksStory />);
