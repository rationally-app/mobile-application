let params: any = {};

export const mockNavigation: any = {
  navigate: jest.fn(),
  dispatch: jest.fn(),
  goBack: jest.fn(),
  getParam: (key: string) => params[key],
  addListener: jest.fn(),
  state: {
    routeName: "routeName",
  },
};

export const resetNavigation = (): void => {
  mockNavigation.navigate.mockReset();
  mockNavigation.dispatch.mockReset();
  mockNavigation.goBack.mockReset();
  params = {};
};

export const setParam = (key: string, value: unknown): void => {
  params[key] = value;
};
