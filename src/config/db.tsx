import { RxJsonSchema, RxCollectionCreator, RxDatabaseCreator } from "rxdb";
import { DocumentProperties } from "../types";

export const dbName = "idwallet";
export const dbPassword = "supersecretpassword";

export const db: RxDatabaseCreator = {
  name: dbName,
  adapter: "asyncstorage",
  password: dbPassword,
  multiInstance: false,
  pouchSettings: { skip_setup: true } // eslint-disable-line @typescript-eslint/camelcase
};

export const documentSchema: RxJsonSchema<DocumentProperties> = {
  version: 0,
  type: "object",
  properties: {
    id: {
      type: "string",
      primary: true
    },
    created: {
      type: "number",
      index: true
    },
    verified: {
      type: "number",
      index: true
    },
    isVerified: {
      type: "boolean"
    },
    document: {
      type: "object"
    }
  }
};

export const documentsCollection: RxCollectionCreator = {
  name: "documents",
  schema: documentSchema
};
