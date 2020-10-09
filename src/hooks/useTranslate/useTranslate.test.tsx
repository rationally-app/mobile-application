import { HookResult, renderHook } from "@testing-library/react-hooks";
import React, { FunctionComponent } from "react";
import { CampaignConfigContextProvider } from "../../context/campaignConfig";
import {
  CampaignConfigsMap,
  CampaignConfigsStoreContextProvider
} from "../../context/campaignConfigsStore";
import { defaultFeatures, defaultProducts } from "../../test/helpers/defaults";
import { TranslationHook, useTranslate } from "./useTranslate";

const mockGetItem = jest.fn();
jest.mock("react-native/Libraries/Storage/AsyncStorage", () => ({
  getItem: mockGetItem
}));

describe("useTranslate", () => {
  let allCampaignConfigs: CampaignConfigsMap;
  let wrapper: FunctionComponent;
  let result: HookResult<TranslationHook>;

  beforeAll(() => {
    allCampaignConfigs = {
      campaignA: {
        features: { ...defaultFeatures, campaignName: "Some Campaign Name" },
        policies: [defaultProducts[0]],
        c13n: {
          "Some Campaign Name": "某个活动名称",
          "Toilet Paper": "厕纸",
          first: "第一"
        }
      },
      campaignB: {
        features: {
          ...defaultFeatures,
          campaignName: "Another Campaign Name"
        },
        policies: [defaultProducts[1]],
        c13n: {
          "Another Campaign Name": "另一个活动名称",
          Chocolate: "巧克力",
          bar: "块"
        }
      }
    };
    mockGetItem.mockImplementation(() => JSON.stringify(allCampaignConfigs));
  });

  describe("c13nt", () => {
    beforeAll(() => {
      // eslint-disable-next-line react/display-name
      wrapper = ({ children }) => (
        <CampaignConfigsStoreContextProvider>
          <CampaignConfigContextProvider
            campaignConfig={allCampaignConfigs.campaignA!}
          >
            {children}
          </CampaignConfigContextProvider>
        </CampaignConfigsStoreContextProvider>
      );
      const { result: translationResult, waitForNextUpdate } = renderHook(
        () => useTranslate(),
        {
          wrapper
        }
      );
      waitForNextUpdate();
      result = translationResult;
    });

    it("should return translation from current campaign c13n if no campaignKey is passed", () => {
      expect.assertions(3);
      expect(result.current.c13nt("Some Campaign Name")).toEqual(
        "某个活动名称"
      );
      expect(result.current.c13nt("Toilet Paper")).toEqual("厕纸");
      expect(result.current.c13nt("first")).toEqual("第一");
    });

    it("should return translation from target campaign if its campaign key is passed", () => {
      expect.assertions(3);
      expect(
        result.current.c13nt("Another Campaign Name", "campaignB")
      ).toEqual("另一个活动名称");
      expect(result.current.c13nt("Chocolate", "campaignB")).toEqual("巧克力");
      expect(result.current.c13nt("bar", "campaignB")).toEqual("块");
    });

    it("should return key if key does not exist in c13n", () => {
      expect.assertions(4);
      expect(result.current.c13nt("Key that is not in C13N")).toEqual(
        "Key that is not in C13N"
      );
      expect(result.current.c13nt("")).toEqual("");
      expect(result.current.c13nt("Some Campaign Name", "campaignB")).toEqual(
        "Some Campaign Name"
      );
      expect(result.current.c13nt("", "campaignB")).toEqual("");
    });
  });

  describe("c13ntForUnit", () => {
    beforeAll(() => {
      // eslint-disable-next-line react/display-name
      wrapper = ({ children }) => (
        <CampaignConfigsStoreContextProvider>
          <CampaignConfigContextProvider
            campaignConfig={allCampaignConfigs.campaignB!}
          >
            {children}
          </CampaignConfigContextProvider>
        </CampaignConfigsStoreContextProvider>
      );
      const { result: translationResult, waitForNextUpdate } = renderHook(
        () => useTranslate(),
        {
          wrapper
        }
      );
      waitForNextUpdate();
      result = translationResult;
    });

    it("should return translation for label from c13n", () => {
      expect.assertions(1);
      expect(
        result.current.c13ntForUnit({ label: "bar", type: "POSTFIX" })
      ).toEqual({ label: "块", type: "POSTFIX" });
    });

    it("should return label if it doesn't exist in c13n", () => {
      expect.assertions(1);
      expect(
        result.current.c13ntForUnit({ label: "some label", type: "POSTFIX" })
      ).toEqual({ label: "some label", type: "POSTFIX" });
    });
  });
});
