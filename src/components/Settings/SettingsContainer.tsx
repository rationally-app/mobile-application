import React, { FunctionComponent } from "react";
import { NavigationProps } from "../../types";
import { Settings } from "./Settings";
import { useDbContext } from "../../context/db";
import { DB_CONFIG } from "../../config";

export const SettingsContainer: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  const { db } = useDbContext();

  const onResetDocumentData = async (): Promise<void> => {
    await db!.documents.remove();
    await db!.collection(DB_CONFIG.documentsCollection);
    alert("Documents Collection Emptied!");
  };

  return (
    <Settings
      navigation={navigation}
      onResetDocumentData={onResetDocumentData}
    />
  );
};
