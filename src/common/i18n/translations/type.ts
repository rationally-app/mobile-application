export type Translations = {
  blockUser: {
    header: string;
    body: string;
  };
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
    goToStatistics: string;
    nationalityInputLabel: string;
    passportInputLabel: string;
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
    previouslyRedeemedItems: string;
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
  checkoutUnsuccessfulScreen: {
    unsuccessful: string;
    unsuccessfulRedeemAttempt: string;
  };
  customerAppealScreen: {
    raiseAppeal: string;
    indicateReason: string;
  };
  statisticsScreen: {
    distributedAmount: string;
    lastDistributedTiming: string;
    viaAppeal: string;
    noItemsScanned: string;
    title: string;
    back: string;
    quantity: string;
  };
  notEligibleScreen: {
    notEligible: string;
    logAppeal: string;
  };
  campaignInitialisationScreen: {
    appleStore: string;
    androidStore: string;
  };
  identifierSelectionInput: {
    placeholder: string;
  };
  addonsToggleComponent: { "*chargeable": string; "*waive charges": string };
  logoutScreen: {
    loggingOut: string;
  };
  govWalletIncorrectBalanceScreen: {
    govWalletIncorrectBalanceTitle: string;
    govWalletIncorrectBalanceDescription: string;
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
    expiredSession: {
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
    networkError: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    wrongPaymentReceiptNumber: {
      title: string;
      body?: string;
      primaryActionText: string;
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
    wrongFormatRegexQR: {
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
    wrongFormatCodeTextDisabled: {
      title: string;
      body?: string;
      primaryActionText: string;
      secondaryActionText?: string;
    };
    incompleteWaiveReason: {
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
    incompleteEntryCodeTextDisabled: {
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
    missingDisbursements: {
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
    systemErrorLogoutIssue: {
      title: string;
      body?: string;
      primaryActionText: string;
    };
    dynamicContentFallback: {
      minutes: string;
    };
    deformedPaymentQR: {
      title: string;
      body?: string;
      primaryActionText: string;
    };
    missingInfoInPaymentQR: {
      title: string;
      body?: string;
      primaryActionText: string;
    };
    unsupportedPaymentMethodInPaymentQR: {
      title: string;
      body?: string;
      primaryActionText: string;
    };
    deformedPaymentQRTextDisabled: {
      title: string;
      body?: string;
      primaryActionText: string;
    };
    missingInfoInPaymentQRTextDisabled: {
      title: string;
      body?: string;
      primaryActionText: string;
    };
    unsupportedPaymentMethodInPaymentQRTextDisabled: {
      title: string;
      body?: string;
      primaryActionText: string;
    };
    govwalletAccountDeactivated: {
      title: string;
      body?: string;
      primaryActionText: string;
    };
    govWalletAccountInvalid: {
      title: string;
      body?: string;
      primaryActionText: string;
    };
    rootedDeviceDetected: {
      title: string;
      body?: string;
      primaryActionText: string;
    };
    http500Error: {
      title: string;
      body?: string;
      primaryActionText: string;
    };
    http502Error: {
      title: string;
      body?: string;
      primaryActionText: string;
    };
    http503Error: {
      title: string;
      body?: string;
      primaryActionText: string;
    };
    http504Error: {
      title: string;
      body?: string;
      primaryActionText: string;
    };
  };
};
