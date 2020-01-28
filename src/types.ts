import {
  NavigationParams,
  NavigationScreenProp,
  NavigationRoute
} from "react-navigation";
import { RxDocument, RxCollection, RxDatabase } from "rxdb";
import { Document } from "@govtechsg/open-attestation";

export interface NavigationProps {
  navigation: NavigationScreenProp<NavigationRoute, NavigationParams>;
}

export type DocumentProperties = {
  id: string;
  created: number;
  document: Document;
  verified?: number;
  isVerified?: boolean;
  qrCode?: {
    url: string;
    expiry?: number;
  };
};

export type DocumentObject = RxDocument<DocumentProperties>;
export type DatabaseCollections = {
  documents: RxCollection<DocumentProperties>;
};
export type Database = RxDatabase<DatabaseCollections>;
