// import { IS_MOCK } from "../../config";
// import { Transaction, Quota, PostTransactionResult } from "../../types";
// import { fetchWithValidator, ValidationError } from "../helpers";
// import * as Sentry from "sentry-expo";

export class EligibilityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EligibilityError";
  }
}

// export const liveGetEligibility = async (
//   ids: string[],
//   _key: string,
//   _endpoint: string
// ): Promise<boolean> => {
//   let response;
//   if (ids.length === 0) {
//     throw new EligibilityError("No ID was provided");
//   }
//   try {
//     if (ids.length === 1) {
//       response = await fetchWithValidator(
//         Quota,
//         `${_endpoint}/quota/${ids[0]}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: key
//           }
//         }
//       );

//   }
//   return true;
// };

export const mockGetEligibility = async (
  ids: string[],
  _key: string,
  _endpoint: string
): Promise<boolean> => {
  return false;
};

export const getEligibility = mockGetEligibility;

// export const getEligibility = IS_MOCK ? mockGetEligibility : liveGetEligibility;
