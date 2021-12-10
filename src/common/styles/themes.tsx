import React, { ReactElement } from "react";
import { ViewStyle } from "react-native";
import AppLogo from "../../../assets/Logo.svg";
import GovWalletAppLogo from "../../../assets/gw-logo.svg";
import { color } from "../../common/styles";

export const SALLY_THEME_NAME = "DEFAULT";
export const GOVWALLET_THEME_NAME = "GOVWALLET";

export type CustomTheme = {
  name: string;
  logo: () => ReactElement;
  appTextColor: string;
  topBackground: {
    production: {
      primaryColor: string;
      secondaryColor: string;
    };
    staging: {
      primaryColor: string;
      secondaryColor: string;
    };
  };
  darkButton: {
    enabled: {
      borderColor: ViewStyle["borderColor"];
      backgroundColor: ViewStyle["backgroundColor"];
    };
    disabled: {
      borderColor: ViewStyle["borderColor"];
      backgroundColor: ViewStyle["backgroundColor"];
    };
  };
  secondaryButton: {
    enabled: {
      borderColor: ViewStyle["borderColor"];
      textColor: string;
    };
    disabled: {
      borderColor: ViewStyle["borderColor"];
      textColor: string;
    };
  };
  drawer: {
    openButtonColor: string;
    generalButtonColor: string;
  };
  checkoutSuccessCard: {
    backgroundColor: string;
    thumbsUpIconColor: string;
  };
  checkoutUnsuccessfulCard: {
    backgroundColor: string;
    thumbsDownIconColor: string;
  };
  customerCard: {
    userIconColor: string;
    successfulHeaderColor: ViewStyle["backgroundColor"];
    unsuccessfulHeaderColor: ViewStyle["backgroundColor"];
    idTextColor: string;
    idLabelColor: string;
  };
  collectCustomerDetails: {
    statsIconColor: string;
    needHelpIcon: string;
    needHelpText: string;
  };
  statisticsScreen: {
    topBackgroundColor?: string;
    headerBackButtonColor: string;
    headerTextColor: string;
    headerDrawerButtonColor: string;
    statTextColor: string;
    smallTextColor: string;
    dateTextColor: string;
    enabledChevron: string;
    enabledChevronOpacity: number;
    disabledChevron: string;
    disabledChevronOpacity: number;
  };
  alertModal: {
    titleColor: string;
  };
};

export const govWalletTheme: CustomTheme = {
  name: GOVWALLET_THEME_NAME,
  // eslint-disable-next-line react/display-name
  logo: (): ReactElement => {
    return <GovWalletAppLogo />;
  },
  appTextColor: "#424242",
  // FFF2F2
  topBackground: {
    production: {
      primaryColor: "#F5F5F5",
      secondaryColor: "#F5F5F5",
    },
    staging: {
      primaryColor: "#F5F5F5",
      secondaryColor: "#F5F5F5",
    },
  },
  darkButton: {
    enabled: {
      borderColor: "#C92031" as ViewStyle["borderColor"],
      backgroundColor: "#C92031" as ViewStyle["backgroundColor"],
    },
    disabled: {
      borderColor: color("grey", 40) as ViewStyle["borderColor"],
      backgroundColor: color("grey", 40) as ViewStyle["backgroundColor"],
    },
  },
  secondaryButton: {
    enabled: {
      borderColor: "#C92031" as ViewStyle["borderColor"],
      textColor: "#C92031",
    },
    disabled: {
      borderColor: color("grey", 40) as ViewStyle["borderColor"],
      textColor: color("grey", 40),
    },
  },
  drawer: {
    openButtonColor: "#424242",
    generalButtonColor: "#424242",
  },
  checkoutSuccessCard: {
    backgroundColor: "#F8FFED",
    thumbsUpIconColor: "#3C9618",
  },
  checkoutUnsuccessfulCard: {
    backgroundColor: "#FFF2F2",
    thumbsDownIconColor: "C92031",
  },
  customerCard: {
    userIconColor: "#424242",
    successfulHeaderColor: "#FFFFFF" as ViewStyle["backgroundColor"],
    unsuccessfulHeaderColor: "#FFFFFF" as ViewStyle["backgroundColor"],
    idTextColor: "#424242",
    idLabelColor: "#424242",
  },
  collectCustomerDetails: {
    statsIconColor: "#424242",
    needHelpIcon: "#424242",
    needHelpText: "#424242",
  },
  statisticsScreen: {
    topBackgroundColor: "#FFF2F2",
    headerBackButtonColor: "#424242",
    headerTextColor: "#424242",
    headerDrawerButtonColor: "#424242",
    statTextColor: "#424242",
    smallTextColor: "#424242",
    dateTextColor: "#424242",
    enabledChevron: "#424242",
    enabledChevronOpacity: 1,
    disabledChevron: "#424242",
    disabledChevronOpacity: 0.25,
  },
  alertModal: {
    titleColor: "#424242",
  },
};

export const sallyTheme: CustomTheme = {
  name: SALLY_THEME_NAME,
  // eslint-disable-next-line react/display-name
  logo: (): ReactElement => {
    return <AppLogo />;
  },
  appTextColor: color("blue", 50),
  topBackground: {
    production: {
      primaryColor: color("blue", 50),
      secondaryColor: color("blue-green", 40),
    },
    staging: {
      primaryColor: color("red", 40),
      secondaryColor: color("orange", 30),
    },
  },
  darkButton: {
    enabled: {
      borderColor: color("blue", 50) as ViewStyle["borderColor"],
      backgroundColor: color("blue", 50) as ViewStyle["backgroundColor"],
    },
    disabled: {
      borderColor: color("grey", 40) as ViewStyle["borderColor"],
      backgroundColor: color("grey", 40) as ViewStyle["backgroundColor"],
    },
  },
  secondaryButton: {
    enabled: {
      borderColor: color("blue", 50) as ViewStyle["borderColor"],
      textColor: color("blue", 50),
    },
    disabled: {
      borderColor: color("grey", 40) as ViewStyle["borderColor"],
      textColor: color("grey", 40),
    },
  },
  drawer: {
    openButtonColor: color("grey", 0),
    generalButtonColor: color("blue", 50),
  },
  checkoutSuccessCard: {
    backgroundColor: color("green", 10),
    thumbsUpIconColor: color("blue-green", 40),
  },
  checkoutUnsuccessfulCard: {
    backgroundColor: color("red", 10),
    thumbsDownIconColor: color("red", 60),
  },
  customerCard: {
    userIconColor: color("grey", 0),
    successfulHeaderColor: color("blue-green", 40),
    unsuccessfulHeaderColor: color("red", 60),
    idTextColor: color("grey", 0),
    idLabelColor: color("grey", 0),
  },
  collectCustomerDetails: {
    statsIconColor: color("blue", 50),
    needHelpIcon: color("blue", 40),
    needHelpText: color("blue", 40),
  },
  statisticsScreen: {
    headerBackButtonColor: "white",
    headerTextColor: "white",
    headerDrawerButtonColor: color("grey", 0),
    statTextColor: "white",
    smallTextColor: "white",
    dateTextColor: "white",
    enabledChevron: "white",
    enabledChevronOpacity: 1,
    disabledChevron: "#597585",
    disabledChevronOpacity: 1,
  },
  alertModal: {
    titleColor: color("blue", 50),
  },
};
