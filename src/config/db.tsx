export const dbName = "identitywallet";
export const dbPassword = "supersecretpassword";

export const db = {
  name: dbName,
  adapter: "asyncstorage",
  password: dbPassword,
  multiInstance: false,
  pouchSettings: { skip_setup: true } // eslint-disable-line @typescript-eslint/camelcase
};

export const documentSchema = {
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
    document: {
      type: "object"
    }
  }
};

export const documentTableName = "documents";

export const documentsCollection = {
  name: documentTableName,
  schema: documentSchema
};
