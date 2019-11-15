import {
  NavigationParams,
  NavigationScreenProp,
  NavigationState
} from "react-navigation";
import { Document } from "@govtechsg/open-attestation";

export interface NavigationProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

export interface DocumentObject {
  id: string;
  created: number;
  document: Document;
  verified?: number;
  isVerified?: boolean;
}
