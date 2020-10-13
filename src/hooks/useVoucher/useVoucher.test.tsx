import { renderHook } from "@testing-library/react-hooks";
import { useVoucher } from "./useVoucher";
import { wait } from "@testing-library/react-native";
import { postTransaction } from "../../services/quota";

jest.mock("../../services/quota");
const mockPostTransaction = postTransaction as jest.Mock;

const key = "KEY";
const endpoint = "https://myendpoint.com";

const transactionTime = new Date(2020, 3, 1);

const transactions = [
  {
    category: "voucher",
    quantity: 2,
    identifierInputs: [
      {
        label: "Merchant Code",
        value: "CDC-0001"
      }
    ]
  }
];

const mockPostTransactionResult = {
  transactions: [
    {
      transaction: transactions,
      transactionTime
    }
  ]
};

describe("useVoucher", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("update vouchers when removing voucher", () => {
    it("should update vouchers when voucher is removed", async () => {
      expect.assertions(2);
      const { result } = renderHook(() => useVoucher(key, endpoint));

      await wait(() => {
        result.current.addVoucher({ serial: "123456789", denomination: 2 });
      });

      expect(result.current.vouchers).toStrictEqual([
        { serial: "123456789", denomination: 2 }
      ]);

      await wait(() => {
        result.current.removeVoucher("123456789");
      });

      expect(result.current.vouchers).toStrictEqual([]);
    });

    it("update vouchers correctly when voucher is removed", async () => {
      expect.assertions(2);
      const { result } = renderHook(() => useVoucher(key, endpoint));

      await wait(() => {
        result.current.addVoucher({ serial: "123456789", denomination: 2 });
        result.current.addVoucher({ serial: "123456788", denomination: 2 });
      });

      expect(result.current.vouchers).toStrictEqual([
        { serial: "123456789", denomination: 2 },
        { serial: "123456788", denomination: 2 }
      ]);

      await wait(() => {
        result.current.removeVoucher("123456788");
      });
      expect(result.current.vouchers).toStrictEqual([
        { serial: "123456789", denomination: 2 }
      ]);
    });

    it("should not update vouchers when voucher to be removed does not exist", async () => {
      expect.assertions(2);
      const { result } = renderHook(() => useVoucher(key, endpoint));

      await wait(() => {
        result.current.addVoucher({ serial: "123456789", denomination: 2 });
        result.current.addVoucher({ serial: "123456788", denomination: 2 });
      });

      expect(result.current.vouchers).toStrictEqual([
        { serial: "123456789", denomination: 2 },
        { serial: "123456788", denomination: 2 }
      ]);

      await wait(() => {
        result.current.removeVoucher("invalid");
      });
      expect(result.current.vouchers).toStrictEqual([
        { serial: "123456789", denomination: 2 },
        { serial: "123456788", denomination: 2 }
      ]);
    });

    it("should maintain vouchers when vouchers are removed", async () => {
      expect.assertions(3);
      const { rerender, result } = renderHook(() => useVoucher(key, endpoint));

      await wait(() => {
        result.current.addVoucher({ serial: "123456789", denomination: 2 });
        result.current.addVoucher({ serial: "123456788", denomination: 2 });
      });

      expect(result.current.vouchers).toStrictEqual([
        { serial: "123456789", denomination: 2 },
        { serial: "123456788", denomination: 2 }
      ]);

      await wait(() => {
        result.current.removeVoucher("123456788");
      });

      expect(result.current.vouchers).toStrictEqual([
        { serial: "123456789", denomination: 2 }
      ]);
      rerender();
      expect(result.current.vouchers).toStrictEqual([
        { serial: "123456789", denomination: 2 }
      ]);
    });
  });

  describe("update vouchers when adding voucher", () => {
    it("should update vouchers when new voucher is added", async () => {
      expect.assertions(1);
      const { result } = renderHook(() => useVoucher(key, endpoint));

      await wait(() => {
        result.current.addVoucher({ serial: "123456789", denomination: 2 });
      });

      expect(result.current.vouchers).toStrictEqual([
        { serial: "123456789", denomination: 2 }
      ]);
    });

    it("should maintain vouchers when more vouchers are added", async () => {
      expect.assertions(2);
      const { rerender, result } = renderHook(() => useVoucher(key, endpoint));

      await wait(() => {
        result.current.addVoucher({ serial: "123456789", denomination: 2 });
      });

      expect(result.current.vouchers).toStrictEqual([
        { serial: "123456789", denomination: 2 }
      ]);
      rerender();
      expect(result.current.vouchers).toStrictEqual([
        { serial: "123456789", denomination: 2 }
      ]);
    });
  });

  describe("checkout voucher", () => {
    it("should set the correct checkoutResult when checkoutVouchers is called", async () => {
      expect.assertions(4);

      const { result } = renderHook(() => useVoucher(key, endpoint));

      await wait(() => {
        result.current.addVoucher({ serial: "123456789", denomination: 2 });
        result.current.addVoucher({ serial: "123456788", denomination: 2 });
      });

      const mockMerchantCode = "12345678";
      mockPostTransaction.mockReturnValueOnce(mockPostTransactionResult);

      await wait(() => {
        result.current.checkoutVouchers(mockMerchantCode);
        expect(result.current.checkoutVouchersState).toBe("CONSUMING_VOUCHER");
      });

      expect(result.current.checkoutVouchersState).toBe("RESULT_RETURNED");
      expect(result.current.vouchers).toStrictEqual([
        {
          serial: "123456789",
          denomination: 2
        },
        {
          serial: "123456788",
          denomination: 2
        }
      ]);
      expect(result.current.checkoutResult).toStrictEqual(
        mockPostTransactionResult
      );
    });

    it("should set error when merchant code is invalid", async () => {
      expect.assertions(3);

      const { result } = renderHook(() => useVoucher(key, endpoint));
      const mockMerchantCode = "<script>";

      await wait(() => {
        result.current.addVoucher({ serial: "123456789", denomination: 2 });
        result.current.checkoutVouchers(mockMerchantCode);
      });

      expect(result.current.error?.message).toBe("Invalid merchant code");
      expect(result.current.checkoutVouchersState).toBe("CONSUMING_VOUCHER");
      expect(result.current.vouchers).toStrictEqual([
        {
          serial: "123456789",
          denomination: 2
        }
      ]);
    });

    it("should set error when transaction does not succeed", async () => {
      expect.assertions(3);
      const { result } = renderHook(() => useVoucher(key, endpoint));

      await wait(() => {
        result.current.addVoucher({ serial: "123456789", denomination: 2 });
        result.current.addVoucher({ serial: "123456788", denomination: 2 });
      });

      const mockMerchantCode = "12345678";
      mockPostTransaction.mockRejectedValueOnce(
        new Error("Couldn't checkout, please try again later")
      );

      await wait(() => {
        result.current.checkoutVouchers(mockMerchantCode);
      });

      expect(result.current.error?.message).toBe(
        "Couldn't checkout, please try again later"
      );
      expect(result.current.checkoutVouchersState).toBe("CONSUMING_VOUCHER");
      expect(result.current.vouchers).toStrictEqual([
        {
          serial: "123456789",
          denomination: 2
        },
        {
          serial: "123456788",
          denomination: 2
        }
      ]);
    });
  });
});
