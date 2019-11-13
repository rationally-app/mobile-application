import React, { useEffect, FunctionComponent } from "react";
import { Text, View } from "react-native";
import { NavigationProps } from "./types";
import { useDbContext } from "../context/db";
import sampleData from "../sample.json";
import * as RxDB from "rxdb";
import { get } from "lodash";
import { Document } from "@govtechsg/open-attestation";
import { DB_CONFIG } from "../config";

RxDB.plugin(require("pouchdb-adapter-asyncstorage").default);

const createDatabase = async (): Promise<RxDB.RxDatabase> => {
  const db = await RxDB.create(DB_CONFIG.db);
  await db.collection(DB_CONFIG.documentsCollection);
  return db;
};

const seedDb = async (db: RxDB.RxDatabase, doc: Document): Promise<void> => {
  const id = get(doc, "signature.targetHash");
  const defaultDocument = await db.documents.findOne({ id }).exec();
  if (!defaultDocument) {
    await db.documents.insert({
      id,
      created: Date.now(),
      document: doc
    });
  }
};

const init = async ({
  setDb,
  done
}: {
  setDb?: Function;
  done: Function;
}): Promise<void> => {
  const db = await createDatabase();
  setDb!(db);
  await seedDb(db, sampleData);
  done();
};

const LoadingScreen: FunctionComponent<NavigationProps> = ({
  navigation
}: NavigationProps) => {
  const { setDb } = useDbContext();

  // To initialise database
  useEffect(() => {
    init({
      setDb,
      done: () => navigation.navigate("StackNavigator")
    });
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Loading...</Text>
    </View>
  );
};

export default LoadingScreen;
