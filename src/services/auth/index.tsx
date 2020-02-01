import { ENDPOINT } from "../../config";

export const authenticate = async (key: string): Promise<boolean> => {
  try {
    const response = await fetch(`${ENDPOINT}/auth`, {
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
