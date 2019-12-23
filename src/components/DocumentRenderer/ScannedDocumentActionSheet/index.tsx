import React, { FunctionComponent } from "react";
import { View, Text } from "react-native";
import { DARK } from "../../../common/colors";
import { DarkButton } from "../../Layout/Buttons/DarkButton";
import { Button } from "../../Layout/Buttons/Button";
import { VerificationStatuses } from "../../../common/hooks/useDocumentVerifier";
import { ValidityBanner } from "../../Validity";

export interface SavableActionSheet {
  onSave?: () => void;
  onCancel?: () => void;
}

export const SavableActionSheet: FunctionComponent<SavableActionSheet> = ({
  onCancel,
  onSave
}) => {
  return (
    <View style={{ flexDirection: "row-reverse" }}>
      <View style={{ margin: 5 }}>
        <DarkButton text="Save" onPress={onSave} />
      </View>
      <View style={{ margin: 5 }}>
        <Button text="Cancel" onPress={onCancel} />
      </View>
    </View>
  );
};

export interface UnsavableActionSheet {
  onDone?: () => void;
}

export const UnsavableActionSheet: FunctionComponent<UnsavableActionSheet> = ({
  onDone
}) => {
  return (
    <View style={{ flexDirection: "row-reverse" }}>
      <View style={{ margin: 5 }}>
        <DarkButton text="Done" onPress={onDone} />
      </View>
    </View>
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
    <View
      style={{
        padding: 12,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 16,
        paddingBottom: 24
      }}
    >
      <ValidityBanner {...verificationStatuses} />
      <View style={{ marginTop: 12, marginBottom: 18 }}>
        <Text style={{ color: DARK, marginBottom: 5 }}>Issued by</Text>
        <Text
          style={{
            color: DARK,
            fontWeight: "bold",
            fontSize: 14,
            textTransform: "uppercase",
            letterSpacing: 0.5
          }}
        >
          {issuedBy}
        </Text>
      </View>
      {isSavable ? (
        <SavableActionSheet onCancel={onCancel} onSave={onSave} />
      ) : (
        <UnsavableActionSheet onDone={onDone} />
      )}
    </View>
  );
};
