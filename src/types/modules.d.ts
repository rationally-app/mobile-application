declare module "*.svg" {
  import { SvgProps } from "react-native-svg";
  const content: React.StatelessComponent<SvgProps>;
  export default content;
}

declare module "react-native-dotenv" {
  export const SENTRY_ORG: string;
  export const SENTRY_PROJECT: string;
  export const SENTRY_AUTH_TOKEN: string;
  export const SENTRY_DSN: string;
  export const ENV: "dev" | "prod";
}
