import React, { FunctionComponent, useEffect } from "react";
import { useDocumentVerifier } from "../../common/hooks/useDocumentVerifier";
import { NavigationProps } from "../../types";
import { SignedDocument } from "@govtechsg/open-attestation";
import { Header } from "../Layout/Header";
import { CheckStatus } from "../Validity/constants";
import { View, SafeAreaView } from "react-native";
import { ValidityCard } from "../Validity/ValidityCard";
import { replaceRouteFn } from "../../common/navigation";

export const ValidityCheckScreenContainer: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  const document: SignedDocument = navigation.getParam("document");
  const isSavable: boolean = navigation.getParam("savable");
  const verificationStatuses = useDocumentVerifier(document as SignedDocument);

  useEffect(() => {
    let cancelled = false;
    if (verificationStatuses.overallValidity === CheckStatus.VALID) {
      setTimeout(() => {
        if (!cancelled) {
          replaceRouteFn(navigation, "ScannedDocumentScreen", {
            document,
            savable: isSavable,
            verificationStatuses
          })();
        }
      }, 500);
    }
    return () => {
      cancelled = true;
    };
  }, [document, isSavable, navigation, verificationStatuses]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        goBack={() => navigation.goBack()}
        hasShadow={false}
        style={{
          backgroundColor: "transparent"
        }}
      />
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <ValidityCard {...verificationStatuses} />
      </View>
    </SafeAreaView>
  );
};
