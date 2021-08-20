import { allSettled } from "./promiseAllSettled";

describe("promiseAllSettled", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("should resolve to an array of results if all passed", async () => {
    expect.assertions(1);
    const result = allSettled([
      Promise.resolve(10),
      Promise.resolve(105),
      new Promise((resolve) => setTimeout(() => resolve(20), 1000)),
    ]);
    jest.runAllTimers();
    await expect(result).resolves.toStrictEqual([
      { status: "fulfilled", value: 10 },
      { status: "fulfilled", value: 105 },
      { status: "fulfilled", value: 20 },
    ]);
  });

  it("should resolve to an array of reasons if all fail", async () => {
    expect.assertions(1);
    const result = allSettled([
      Promise.reject(new Error("error 1")),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("error 2")), 500)
      ),
      new Promise(() => {
        throw new Error("error 3");
      }),
    ]);
    jest.runAllTimers();
    await expect(result).resolves.toStrictEqual([
      { status: "rejected", reason: new Error("error 1") },
      { status: "rejected", reason: new Error("error 2") },
      { status: "rejected", reason: new Error("error 3") },
    ]);
  });

  it("should resolve to an array with the different results if only some resolve", async () => {
    expect.assertions(1);
    const result = allSettled([
      Promise.resolve("abc"),
      Promise.reject(new Error("error c")),
      new Promise((_, rej) => setTimeout(() => rej(new Error("error d")), 250)),
      new Promise((res) => setTimeout(() => res("def"), 500)),
    ]);
    jest.runAllTimers();
    await expect(result).resolves.toStrictEqual([
      { status: "fulfilled", value: "abc" },
      { status: "rejected", reason: new Error("error c") },
      { status: "rejected", reason: new Error("error d") },
      { status: "fulfilled", value: "def" },
    ]);
  });
});
