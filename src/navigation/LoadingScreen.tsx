import React, { useEffect, FunctionComponent } from "react";
import { NavigationProps, DatabaseCollections, Database } from "../types";
import { useDbContext } from "../context/db";
import * as RxDB from "rxdb";
import { DB_CONFIG } from "../config";
import { LoadingView } from "../components/Loading";
import * as SQLite from "expo-sqlite";
import SQLiteAdapterFactory from "pouchdb-adapter-react-native-sqlite";

RxDB.plugin(SQLiteAdapterFactory(SQLite));

const createDatabase = async (): Promise<Database> => {
  const db = await RxDB.create<DatabaseCollections>(DB_CONFIG.db);
  await db.collection(DB_CONFIG.documentsCollection);
  return db;
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
