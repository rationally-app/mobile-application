declare module "*.svg" {
  import { SvgProps } from "react-native-svg";
  const content: React.StatelessComponent<SvgProps>;
  export default content;
}

declare module "@react-native-async-storage/async-storage/jest/async-storage-mock" {
  export default "*" as any;
}
