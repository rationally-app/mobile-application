import { reconstructAction, initialiseDb } from "./utils";
import { DB_CONFIG } from "../../config";
import * as RxDB from "rxdb";

jest.mock("pouchdb-adapter-react-native-sqlite");
jest.mock("rxdb");

describe("InitialisationContainer/utils", () => {
  describe("initialiseDb", () => {
    it("should not set db if db is already present (in context)", async () => {
      expect.assertions(2);
      const rxdbCreate = RxDB.create as jest.Mock;
      const mockDb: any = "DB";
      rxdbCreate.mockResolvedValue("MOCK_DB");
      const setDb = jest.fn();
      const onInitDb = jest.fn();
      await initialiseDb({ setDb, onInitDb, db: mockDb });
      expect(setDb).not.toHaveBeenCalled();
      expect(onInitDb).toHaveBeenCalledTimes(1);
    });
    it("should set db if db is not setup (in context)", async () => {
      expect.assertions(3);
      const rxdbCreate = RxDB.create as jest.Mock;
      const mockCreatedDb = { collection: jest.fn() };
      rxdbCreate.mockResolvedValue(mockCreatedDb);
      const setDb = jest.fn();
      const onInitDb = jest.fn();
      await initialiseDb({ setDb, onInitDb });
      expect(mockCreatedDb.collection).toHaveBeenCalledWith(
        DB_CONFIG.documentsCollection
      );
      expect(setDb).toHaveBeenCalledWith(mockCreatedDb);
      expect(onInitDb).toHaveBeenCalledTimes(1);
    });
  });

  describe("reconstructAction", () => {
    it("should return undefined if there are no valid payloads", () => {
      expect.assertions(1);
      expect(reconstructAction({})).toBeUndefined();
    });
    it("should return correct action string for document type actions", () => {
      expect.assertions(1);
      const documentPayload =
        "%7B%22uri%22:%22https://api.myjson.com/bins/95dti%22,%22permittedActions%22:%5B%22STORE%22%5D%7D";
      expect(reconstructAction({ documentPayload })).toBe(
        "https://openattestation.com/action?document=%7B%22uri%22:%22https://api.myjson.com/bins/95dti%22,%22permittedActions%22:%5B%22STORE%22%5D%7D"
      );
    });
  });
});
