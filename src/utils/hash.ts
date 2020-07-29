import { digestStringAsync, CryptoDigestAlgorithm } from "expo-crypto";

export const hashString = async (str: string): Promise<string> =>
  await digestStringAsync(CryptoDigestAlgorithm.SHA256, str);
