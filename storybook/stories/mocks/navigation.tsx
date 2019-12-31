export const navigation: any = {
  navigate: (path: string): void => alert(path),
  dispatch: (action: any): void => alert(JSON.stringify(action)),
  goBack: () => alert("Back"),
  addListener: () => ({ remove: () => null }),
  state: {
    routeName: "routeName"
  }
};
