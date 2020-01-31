import { authenticate } from "./index";
import { ENDPOINT } from "../../config";

const anyGlobal: any = global;
const mockFetch = jest.fn();
anyGlobal.fetch = mockFetch;

describe("authenticate", () => {
  it("should check the validity of the key", async () => {
    expect.assertions(2);
    mockFetch.mockReturnValueOnce({
      then: () => ({
        message: "OK"
      })
    });
    const auth = await authenticate("CORRECT_KEY");
    expect(mockFetch.mock.calls[0]).toEqual([
      `${ENDPOINT}/auth`,
      { method: "GET", headers: { Authorization: "CORRECT_KEY" } }
    ]);
    expect(auth).toBe(true);
  });

  it("should return false when the fetch fail", async () => {
    expect.assertions(1);
    mockFetch.mockRejectedValueOnce("Boom");
    const auth = await authenticate("INCORRECT_TOKEN");
    expect(auth).toBe(false);
  });
});
