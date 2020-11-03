let params: any = {};

export const navigation: any = {
  navigate: () => alert(`navigate`),
  dispatch: () => alert(`dispatch`),
  goBack: () => alert(`goBack`),
  getParam: (key: string) => params[key],
  addListener: () => alert(`addListener`),
  state: {
    routeName: "routeName",
  },
};

export const resetNavigation = (): void => {
  navigation.navigate.mockReset();
  navigation.dispatch.mockReset();
  navigation.goBack.mockReset();
  params = {};
};

export const setParam = (key: string, value: unknown): void => {
  params[key] = value;
};
