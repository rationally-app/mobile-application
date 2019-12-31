import React, { FunctionComponent } from "react";
import { View, Text, StyleSheet } from "react-native";
import { DarkButton } from "../../Layout/Buttons/DarkButton";
import { Button } from "../../Layout/Buttons/Button";
import { VerificationStatuses } from "../../../common/hooks/useDocumentVerifier";
import { ValidityBanner } from "../../Validity";
import {
  color,
  size,
  fontSize,
  letterSpacing,
  shadow
} from "../../../common/styles";

const styles = StyleSheet.create({
  actionSheetWrapper: {
    padding: size(3),
    paddingTop: size(2),
    paddingBottom: size(4),
    backgroundColor: color("grey", 5),
    borderColor: color("grey", 10),
    borderWidth: 1,
    ...shadow(3)
  },
  validityBannerWrapper: {
    marginHorizontal: -size(3),
    marginBottom: size(2.5)
  },
  informationWrapper: {
    marginBottom: size(3)
  },
  heading: {
    fontSize: fontSize(-2),
    marginBottom: size(1),
    color: color("grey", 40)
  },
  issuerName: {
    fontSize: fontSize(-1),
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: letterSpacing(1),
    color: color("grey", 40)
  },
  buttonRow: {
    flexDirection: "row-reverse"
  },
  buttonWrapper: {
    marginLeft: size(1)
  }
});

export interface SavableActions {
  onSave?: () => void;
  onCancel?: () => void;
}

export const SavableActions: FunctionComponent<SavableActions> = ({
  onCancel,
  onSave
}) => {
  return (
    <>
      <View style={styles.buttonWrapper}>
        <DarkButton text="Save" onPress={onSave} />
      </View>
      <View style={styles.buttonWrapper}>
        <Button text="Cancel" onPress={onCancel} />
      </View>
    </>
  );
};

export interface UnsavableActions {
  onDone?: () => void;
}

export const UnsavableActions: FunctionComponent<UnsavableActions> = ({
  onDone
}) => {
  return (
    <>
      <View style={styles.buttonWrapper}>
        <DarkButton text="Done" onPress={onDone} />
      </View>
    </>
  );
};

export interface ScannedDocumentActionSheet {
  issuedBy: string;
  isSavable: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  onDone?: () => void;
  verificationStatuses: VerificationStatuses;
}

export const ScannedDocumentActionSheet: FunctionComponent<ScannedDocumentActionSheet> = ({
  issuedBy,
  isSavable,
  onSave,
  onCancel,
  onDone,
  verificationStatuses
}) => {
  return (
    <View style={styles.actionSheetWrapper}>
      <View style={styles.validityBannerWrapper}>
        <ValidityBanner {...verificationStatuses} />
      </View>
      <View style={styles.informationWrapper}>
        <Text style={styles.heading}>Issued by</Text>
        <Text style={styles.issuerName}>{issuedBy}</Text>
      </View>
      <View style={styles.buttonRow}>
        {isSavable ? (
          <SavableActions onCancel={onCancel} onSave={onSave} />
        ) : (
          <UnsavableActions onDone={onDone} />
        )}
      </View>
    </View>
  );
};
