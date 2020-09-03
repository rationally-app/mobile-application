type CheckVersionResult = "OK" | "OUTDATED_BINARY" | "OUTDATED_BUILD";
type CheckVersionProps = {
  currentBinaryVersion: string;
  minBinaryVersion?: string;
  currentBuildVersion: number;
  minBuildVersion?: number;
};

const isBinaryVersionOK = (
  currentBinaryVersion: string,
  minBinaryVersion: string
): boolean => {
  const currentBinaryVersionSplit = currentBinaryVersion.split(".").map(Number);
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

const isBuildVersionOK = (
  currentBuildVersion: number,
  minBuildVersion: number
): boolean => {
  return currentBuildVersion >= minBuildVersion;
};

export const checkVersion = ({
  currentBinaryVersion,
  minBinaryVersion,
  currentBuildVersion,
  minBuildVersion
}: CheckVersionProps): CheckVersionResult => {
  if (currentBinaryVersion === "dev") {
    return "OK";
  }

  if (!minBinaryVersion || minBuildVersion === undefined) {
    throw new Error("Campaign config not loaded");
  }

  if (!isBinaryVersionOK(currentBinaryVersion, minBinaryVersion)) {
    return "OUTDATED_BINARY";
  }
  if (!isBuildVersionOK(currentBuildVersion, minBuildVersion)) {
    return "OUTDATED_BUILD";
  }
  return "OK";
};
