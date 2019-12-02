export const navigation: any = {
  navigate: (path: string): void => alert(path),
  dispatch: (action: any): void => alert(JSON.stringify(action))
};
