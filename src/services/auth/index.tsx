import { ENDPOINT } from "../../config";

export const authenticate = async (key: string): Promise<boolean> => {
  try {
    const status = await fetch(`${ENDPOINT}/auth`, {
      method: "GET",
      headers: {
        Authorization: key
      }
    }).then(res => res.json());
    return status.message === "OK";
  } catch (e) {
    console.error(e);
    return false;
  }
};
