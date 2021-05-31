import React, { FunctionComponent } from "react";
import { CampaignConfigContext } from "../../../src/context/campaignConfig";
import { ImportantMessageContentContext } from "../../../src/context/importantMessage";

export const provider: FunctionComponent<{
  policies?: any;
  story: any;
  isMessageContentContext?: boolean;
}> = ({ policies, story, isMessageContentContext = false }) => {
  return (
    <CampaignConfigContext.Provider
      value={{
        policies: policies,
        features: null,
        c13n: {},
      }}
    >
      {isMessageContentContext ? (
        <>
          <ImportantMessageContentContext.Provider
            value={{
              title: "MessageContent",
            }}
          >
            {story}
          </ImportantMessageContentContext.Provider>
        </>
      ) : (
        { ...story }
      )}
    </CampaignConfigContext.Provider>
  );
};
