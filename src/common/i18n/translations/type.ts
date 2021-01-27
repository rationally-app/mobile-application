export type Translations = {
  loginScanCard: {
    loginWithQR: string;
    scanToLogin: string;
    needHelp: string;
    askQuestion: string;
  };
  loginMobileNumberCard: {
    enterMobileNumber: string;
    mobileNumber: string;
    sendOtp: string;
  };
  loginOTPCard: {
    sendingOtp: string;
    otp: string;
    resendIn: string;
    submit: string;
    resend: string;
  };
  collectCustomerDetailsScreen: {
    checkEligibleItems: string;
    scanIdentification: string;
    or: string;
    enterIdNumber: string;
    check: string;
  };
  idScanner: {
    enterIdManually: string;
    enterManually: string;
    enterVoucherId: string;
    scanToCheck: string;
    continueScanning: string;
    scanBarcode: string;
    scanQRCode: string;
    back: string;
  };
  navigationDrawer: {
    logout: string;
    campaign: string;
    addCampaign: string;
    selectCampaign: string;
    changeChampaign: string;
    helpSupport: string;
    termsOfUse: string;
    privacyStatement: string;
    reportVulnerability: string;
  };
  customerQuotaScreen: {
    campaignExpiredOn: string;
    campaignValidTo: string;
    idNumber: string;
    idNumbers: string;
    quotaLimitMax: string;
    quotaAppealCancel: string;
    quotaButtonCheckout: string;
    quotaButtonAdd: string;
    quotaAddId: string;
    quotaIdentifierButtonScan: string;
    quotaScanButtonBack: string;
    quotaCheck: string;
    id: string;
  };
  merchantFlowScreen: {
    quotaButtonAddVoucher: string;
    quotaCategoryVouchers: string;
    merchantCode: string;
    seeAll: string;
    nextMerchant: string;
    remove: string;
  };
  checkoutSuccessScreen: {
    redeemed: string;
    redeemedItems: string;
    nextIdentity: string;
    purchased: string;
    purchasedItems: string;
    previouslyRedeemedItems: string;
    previouslyPurchasedItems: string;
    redeemedAgo: string;
    redeemedOn: string;
    previouslyRedeemed: string;
    showMore: string;
    showLess: string;
    today: string;
    limitReachedRecent: string;
    limitReachedDate: string;
    limitReached: string;
    redeemedLimitReached: string;
    valid: string;
    complete: string;
    quantity: string;
  };
  customerAppealScreen: {
    raiseAppeal: string;
    indicateReason: string;
  };
  statisticsScreen: {
    distributedAmount: string;
    lastDistributedTiming: string;
    viaAppeal: string;
  };
  notEligibleScreen: {
    notEligible: string;
    logAppeal: string;
    cannot: string;
    purchase: string;
  };
  campaignInitialisationScreen: {
    appleStore: string;
    androidStore: string;
  };
  errorMessages: {
    alreadyUsedDifferentIDNumber: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    alreadyUsedQRCode: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    disabledAccess: {
      title: string;
      body?: string;
      primaryActionText: string;
    };
    cancelEntry: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    confirmLogout: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    incompleteEntryYourContactNumber: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    incompleteEntryVoucherCode: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    incompleteEntryDeviceCode: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    incompleteEntryContactNumber: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    incompleteEntrySelectCheckbox: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    resendOTP: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    systemErrorConnectivityIssues: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    systemErrorValidityPeriod: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    systemErrorLoginIssue: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    systemErrorServerIssue: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    expiredQR: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    expiredOTP: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    emptyOTP: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    invalidInputOTPOneMoreInvalid: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    invalidInputIDNumber: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    invalidInputQR: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    invalidInputOTP: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    incompleteEntry: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    paymentCollected: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    outdatedAppRestart: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    outdatedAppUpdate: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    systemError: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    wrongFormatCountryCode: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    wrongFormatCountryCodePhoneNumber: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    wrongFormatQRScanAgain: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    wrongFormatValidCode: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    wrongFormatDeviceCode: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    wrongFormatID: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    wrongFormatQRGetNew: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    alreadyUsedCode: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    alreadyUsedItem: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    wrongFormatCode: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    incompleteEntryCode: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    wrongFormatNotValidDeviceCode: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    incompleteEntryScanDeviceCode: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    wrongFormatContactNumber: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    insufficientQuota: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    invalidQuantity: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    categoryDoesNotExist: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    systemErrorServerIssues: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    discardTransaction: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    errorScanning: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    scanLimitReached: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    removeItem: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    checkIdFormat: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    notEligible: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    invalidMerchantCode: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    removeVoucher: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    wrongFormatEmailAddress: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    invalidDeviceCode: {
      title: string;
      body?: string;
      primaryActionText: string;
    };
    dynamicContentFallback: {
      minutes: string;
    };
  };
};
