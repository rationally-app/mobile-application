import { renderHook } from "@testing-library/react-hooks";
import { useCheckVoucherValidity } from "./useCheckVoucherValidity";
import { wait } from "@testing-library/react-native";
import { getQuota } from "../../services/quota";
import { Voucher } from "../../types";

jest.mock("../../services/quota");
const mockGetQuota = getQuota as jest.Mock;

const transactionTime = new Date(2020, 3, 1);

const mockValidQuotaRes = {
  remainingQuota: [
    {
      category: "voucher",
      identifiers: [],
      quantity: 1,
      transactionTime
    }
  ]
};

const mockInvalidQuotaRes = {
  remainingQuota: [
    {
      category: "voucher",
      identifiers: [],
      quantity: 0,
      transactionTime
    }
  ]
};

const mockVoucherResult = {
  serial: "123456789",
  denomination: 2
};

const key = "KEY";
const endpoint = "https://myendpoint.com";

describe("useCheckVoucherValidity", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("check voucher validity", () => {
    it("should return voucher if voucher serial is valid", async () => {
      expect.assertions(3);

      const { result } = renderHook(() =>
        useCheckVoucherValidity(key, endpoint)
      );
      const mockVouchersArr: Voucher[] = [];
      mockGetQuota.mockReturnValueOnce(mockValidQuotaRes);

      await wait(() => {
        result.current.checkValidity("123456789", mockVouchersArr);
        expect(result.current.checkValidityState).toBe("CHECKING_VALIDITY");
      });

      expect(result.current.checkValidityState).toBe("RESULT_RETURNED");
      expect(result.current.validityResult).toStrictEqual(mockVoucherResult);
    });

    it("should set error when no voucher code is entered", async () => {
      expect.assertions(2);

      const { result } = renderHook(() =>
        useCheckVoucherValidity(key, endpoint)
      );
      const mockVouchersArr: Voucher[] = [];

      await wait(() => {
        result.current.checkValidity("", mockVouchersArr);
        expect(result.current.checkValidityState).toBe("CHECKING_VALIDITY");
      });

      expect(result.current.error?.message).toBe("No voucher code entered");
    });

    it("should set error when voucher code is invalid", async () => {
      expect.assertions(2);

      const { result } = renderHook(() =>
        useCheckVoucherValidity(key, endpoint)
      );
      const mockVouchersArr: Voucher[] = [];

      await wait(() => {
        result.current.checkValidity("007", mockVouchersArr);
        expect(result.current.checkValidityState).toBe("CHECKING_VALIDITY");
      });

      expect(result.current.error?.message).toBe("Invalid voucher code");
    });

    it("should set error when voucher code is duplicated", async () => {
      expect.assertions(2);

      const { result } = renderHook(() =>
        useCheckVoucherValidity(key, endpoint)
      );
      const mockVouchersArr: Voucher[] = [
        { serial: "123456789", denomination: 2 }
      ];

      await wait(() => {
        result.current.checkValidity("123456789", mockVouchersArr);
        expect(result.current.checkValidityState).toBe("CHECKING_VALIDITY");
      });

      expect(result.current.error?.message).toBe("Duplicate voucher code");
    });

    it("should set error when voucher code is already redeemed", async () => {
      expect.assertions(2);

      const { result } = renderHook(() =>
        useCheckVoucherValidity(key, endpoint)
      );
      const mockVouchersArr: Voucher[] = [];
      mockGetQuota.mockResolvedValue(mockInvalidQuotaRes);

      await wait(() => {
        result.current.checkValidity("000000000", mockVouchersArr);
        expect(result.current.checkValidityState).toBe("CHECKING_VALIDITY");
      });

      expect(result.current.error?.message).toBe("Item redeemed previously");
    });
  });
});
