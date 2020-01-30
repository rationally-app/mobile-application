import { authenticate } from "./index";

it("should authenticate with the right key", async () => {
  const auth = await authenticate("MOCK_KEY");
  expect(auth).toBe(true);
});

it("should not authenticate with the incorrect key", async () => {
  const auth = await authenticate("");
  expect(auth).toBe(false);
});
