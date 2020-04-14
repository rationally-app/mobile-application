import {
  NavigationParams,
  NavigationScreenProp,
  NavigationRoute
} from "react-navigation";

export interface NavigationProps {
  navigation: NavigationScreenProp<NavigationRoute, NavigationParams>;
}

export interface Policy {
  category: string;
  name: string;
  description?: string;
  image?: string;
  order: number;
  quantity: {
    period: number;
    limit: number;
    default?: number;
    step?: number;
    unit?: {
      type: "PREFIX" | "POSTFIX";
      label: string;
    };
  };
}

export enum LOGIN_STAGES {
  SCAN,
  MOBILE_NUMBER,
  OTP
}
