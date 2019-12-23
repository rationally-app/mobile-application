export enum CheckStatus {
  CHECKING = "CHECKING",
  VALID = "VALID",
  INVALID = "INVALID"
}

export const CHECK_MESSAGES = {
  TAMPERED_CHECK: {
    [CheckStatus.CHECKING]: {
      message: "Checking if document has been tampered with"
    },
    [CheckStatus.INVALID]: { message: "Document has been tampered with" },
    [CheckStatus.VALID]: { message: "Document has not been tampered with" }
  },
  ISSUED_CHECK: {
    [CheckStatus.CHECKING]: { message: "Checking if document was issued" },
    [CheckStatus.INVALID]: { message: "Document was not issued" },
    [CheckStatus.VALID]: { message: "Document was issued" }
  },
  REVOKED_CHECK: {
    [CheckStatus.CHECKING]: {
      message: "Checking if document has been revoked"
    },
    [CheckStatus.INVALID]: { message: "Document has been revoked" },
    [CheckStatus.VALID]: { message: "Document has not been revoked" }
  },
  ISSUER_CHECK: {
    [CheckStatus.CHECKING]: { message: "Checking the document's issuer" },
    [CheckStatus.INVALID]: {
      message: "Could not identity the document's issuer"
    },
    [CheckStatus.VALID]: { message: "Document's issuer has been identified" }
  }
};
