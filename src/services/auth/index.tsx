import { STAGING_ENDPOINT, PRODUCTION_ENDPOINT } from "../../config";
import { AppMode } from "../../context/config";

export const authenticate = async (
  key: string,
  mode: AppMode
): Promise<boolean> => {
  const endpoint =
    mode === AppMode.production ? PRODUCTION_ENDPOINT : STAGING_ENDPOINT;
  try {
    const response = await fetch(`${endpoint}/auth`, {
      method: "GET",
      headers: {
        Authorization: key
      }
    });
    if (response.status === 200) {
      const status = await response.json();
      return status.message === "OK";
    }
    return false;
  } catch (e) {
    console.error(e);
    return false;
  }
};
