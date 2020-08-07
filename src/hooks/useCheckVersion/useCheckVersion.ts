import { useContext } from "react";
import { CampaignConfigContext } from "../../context/campaignConfig";
import * as config from "../../config";

type CheckVersionResult = "OK" | "OUTDATED_BINARY" | "OUTDATED_BUILD";

export const useCheckVersion = (): (() => CheckVersionResult) => {
  const { features } = useContext(CampaignConfigContext);

  const isBinaryVersionOK = (): boolean => {
    const currentBinaryVersion = config.APP_BINARY_VERSION;
    if (!currentBinaryVersion) {
      throw new Error("Current app version is not configured properly");
    }

    const minBinaryVersion = features?.minAppBinaryVersion;
    if (!minBinaryVersion) {
      throw new Error("Campaign config not loaded");
    }

    const currentBinaryVersionSplit = currentBinaryVersion
      .split(".")
      .map(Number);
    const minBinaryVersionSplit = minBinaryVersion.split(".").map(Number);
    for (let i = 0; i < minBinaryVersionSplit.length; i++) {
      if (currentBinaryVersionSplit[i] < minBinaryVersionSplit[i]) {
        return false;
      } else if (currentBinaryVersionSplit[i] > minBinaryVersionSplit[i]) {
        return true;
      }
    }
    return true;
  };

  const isBuildVersionOK = (): boolean => {
    const currentBuildVersion = config.APP_BUILD_VERSION;
    if (isNaN(currentBuildVersion)) {
      throw new Error("Current build version is not configured properly");
    }

    const minBuildVersion = features?.minAppBuildVersion;
    if (minBuildVersion === undefined) {
      throw new Error("Campaign config not loaded");
    }

    return currentBuildVersion >= minBuildVersion;
  };

  const check = (): CheckVersionResult => {
    if (!isBinaryVersionOK()) {
      return "OUTDATED_BINARY";
    }
    if (!isBuildVersionOK()) {
      return "OUTDATED_BUILD";
    }
    return "OK";
  };

  return check;
};
