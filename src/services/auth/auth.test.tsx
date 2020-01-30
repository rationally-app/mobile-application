import { authenticate } from "./index";

describe("authenticate", () => {
  it("should authenticate with the right key", async () => {
    expect.assertions(1);
    const auth = await authenticate("MOCK_KEY");
    expect(auth).toBe(true);
  });

  it("should not authenticate with the incorrect key", async () => {
    expect.assertions(1);
    const auth = await authenticate("");
    expect(auth).toBe(false);
  });
});
