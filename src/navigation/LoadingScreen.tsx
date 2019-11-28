import React, { useEffect, FunctionComponent } from "react";
import { NavigationProps, DocumentObject } from "../types";
import { useDbContext } from "../context/db";
import * as RxDB from "rxdb";
import { get } from "lodash";
import { Document } from "@govtechsg/open-attestation";
import { DB_CONFIG } from "../config";
import { LoadingView } from "../components/Loading";
import demoCaas from "../../fixtures/demo-caas.json";
import demoOc from "../../fixtures/demo-oc.json";
import demoTt from "../../fixtures/demo-ebl.json";

RxDB.plugin(require("pouchdb-adapter-asyncstorage").default);

const createDatabase = async (): Promise<RxDB.RxDatabase> => {
  const db = await RxDB.create(DB_CONFIG.db);
  await db.collection(DB_CONFIG.documentsCollection);
  return db;
};

const seedDocument = async (
  db: RxDB.RxDatabase,
  doc: Document
): Promise<void> => {
  const id = get(doc, "signature.targetHash");
  const defaultDocument = await db.documents.findOne({ id }).exec();
  if (!defaultDocument) {
    const documentToInsert: DocumentObject = {
      id,
      created: Date.now(),
      document: doc,
      verified: Date.now(),
      isVerified: true
    };
    await db.documents.insert(documentToInsert);
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
  await seedDocument(db, demoCaas);
  await seedDocument(db, demoOc);
  await seedDocument(db, demoTt);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <LoadingView />;
};

export default LoadingScreen;
