import { requestOTP } from "./index";

const anyGlobal: any = global;
const mockFetch = jest.fn();
anyGlobal.fetch = mockFetch;

describe("requestOTP", () => {
  const phone = "91234567";
  const endpoint = "https://myendpoint.com";

  it("should check the validity of the key", async () => {
    expect.assertions(1);
    mockFetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
    });
    const payload = { code: "CORRECT_KEY", phone };
    await requestOTP(phone, "CORRECT_KEY", endpoint);
    expect(mockFetch.mock.calls[0]).toEqual([
      `${endpoint}/auth/register`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    ]);
  });

  it("should return false when the fetch fail", async () => {
    expect.assertions(1);
    mockFetch.mockRejectedValueOnce(new Error("Boom"));
    await expect(
      requestOTP(phone, "INCORRECT_TOKEN", endpoint)
    ).rejects.toThrow("Boom");
  });
});
