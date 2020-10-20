import { Translations } from "./type";

export const en: Translations = {
  loginScanCard: {
    loginWithQR:
      "Please log in with your unique QR code provided by your supervisor",
    scanToLogin: "Scan to login",
    needHelp: "Need help",
    askQuestion: "Ask a question",
  },
  loginMobileNumberCard: {
    enterMobileNumber:
      "Please enter your mobile phone number to receive a one-time password.",
    mobileNumber: "Mobile phone number",
    sendOtp: "Send OTP",
  },
  loginOTPCard: {
    sendingOtp: "We're sending you the one-time password...",
    otp: "OTP",
    resendIn: "Resend in %{ss}s",
    submit: "Submit",
    resend: "Resend",
  },
  collectCustomerDetailsScreen: {
    checkEligibleItems: "Check the number of item(s) eligible for redemption",
    scanIdentification: "Scan identification",
    or: "OR",
    enterIdNumber: "Enter ID Number",
    check: "Check",
  },
  idScanner: {
    enterIdManually: "Enter ID manually",
    enterManually: "Enter manually",
    enterVoucherId: "Enter voucher ID",
    scanToCheck: "Scan to check validity",
    continueScanning: "Continue scanning",
    scanBarcode: "Scan Barcode",
    scanQRCode: "Scan QR Code",
    back: "Back",
  },
  navigationDrawer: {
    logout: "Logout",
    campaign: "Campaign",
    addCampaign: "Add Campaign",
    selectCampaign: "Select campaign",
    changeChampaign: "Change Campaign",
    helpSupport: "Help & Support",
    termsOfUse: "Terms of use",
    privacyStatement: "Privacy Statement",
    reportVulnerability: "Report Vulnerability",
  },
  customerQuotaScreen: {
    campaignExpiredOn: "Expired on %{dateTime}",
    campaignValidTo: "Valid till %{dateTime}",
    idNumber: "Identification number",
    idNumbers: "Identification numbers",
    quotaLimitMax: "Max",
    quotaAppealCancel: "Cancel",
    quotaButtonCheckout: "Checkout",
    quotaButtonAdd: "Add",
    quotaAddId: "Add another ID to combine customer quotas",
    quotaIdentifierButtonScan: "Scan",
    quotaScanButtonBack: "Back",
    quotaCheck: "Checking...",
    id: "ID",
  },
  merchantFlowScreen: {
    quotaButtonAddVoucher: "Add voucher",
    quotaCategoryVouchers: "Voucher(s)",
    merchantCode: "Merchant Code",
    seeAll: "See all",
    nextMerchant: "Next merchant",
    remove: "Remove",
  },
  checkoutSuccessScreen: {
    redeemed: "Redeemed",
    redeemedItems: "Item(s) redeemed",
    redeemedNextIdentity: "Next identity",
    purchased: "Purchased",
    purchasedItems: "The following have been purchased",
    purchasedNextIdentity: "Next customer",
    previouslyRedeemedItems: "Item(s) redeemed previously",
    previouslyPurchasedItems: "Item(s) purchased previously",
    redeemedAgo: "Redeemed %{time} ago",
    redeemedOn: "Redeemed on %{time}",
    previouslyRedeemed: "Previously redeemed",
    showMore: "Show more",
    showLess: "Show less",
    today: "for today",
    limitReachedRecent: "Limit reached %{time} ago %{today}.",
    limitReachedDate: "Limit reached on %{dateTime} %{today}.",
    limitReached: "Limit reached %{today}.",
    redeemedLimitReached: "%{quantity} item(s) more till %{date}.",
    valid: "Valid",
    complete: "Complete",
    quantity: "qty",
  },
  customerAppealScreen: {
    raiseAppeal: "Raise an appeal",
    indicateReason: "Indicate reason for appeal",
  },
  statisticsScreen: {
    distributedAmount: "You have distributed %{quantity}",
    lastDistributedTiming: "Last distributed at %{dateTime}",
    viaAppeal: "via appeal",
  },
  notEligibleScreen: {
    notEligible: "Not eligible",
    logAppeal: "Please log an appeal request.",
    cannot: "Cannot",
    purchase: "purchase",
  },
  campaignInitialisationScreen: {
    appleStore: "App Store",
    androidStore: "Play Store",
  },
  errorMessages: {
    alreadyUsedDifferentIDNumber: {
      title: "Already used",
      body: "Enter or scan a different ID number.",
      primaryActionText: "OK",
    },
    alreadyUsedQRCode: {
      title: "Already used",
      body:
        "Get a new QR code that is not tagged to any contact number from your in-charge.",
      primaryActionText: "OK",
    },
    disabledAccess: {
      title: "Disabled access",
      body: "Try again in %{minutes} minutes.",
      primaryActionText: "OK",
    },
    cancelEntry: {
      title: "Cancel entry and scan another ID number?",
      primaryActionText: "Cancel entry",
      secondaryActionText: "Keep",
    },
    confirmLogout: {
      title: "Confirm logout?",
      primaryActionText: "Logout",
      secondaryActionText: "No",
    },
    incompleteEntryYourContactNumber: {
      title: "Incomplete entry",
      body: "Enter your contact number.",
      primaryActionText: "OK",
    },
    incompleteEntryVoucherCode: {
      title: "Incomplete entry",
      body: "Enter voucher code details.",
      primaryActionText: "OK",
    },
    incompleteEntryDeviceCode: {
      title: "Incomplete entry",
      body: "Enter device code.",
      primaryActionText: "OK",
    },
    incompleteEntryContactNumber: {
      title: "Incomplete entry",
      body: "Enter contact number",
      primaryActionText: "OK",
    },
    incompleteEntrySelectCheckbox: {
      title: "Incomplete entry",
      body: "Select checkbox.",
      primaryActionText: "OK",
    },
    resendOTP: {
      title: "Resend OTP?",
      body:
        "After 1 more OTP request, you will have to wait 3 minutes before trying again.",
      primaryActionText: "Resend",
      secondaryActionText: "No",
    },
    systemErrorConnectivityIssues: {
      title: "System error",
      body:
        "We are currently facing connectivity issues.\nTry again later or contact your in-charge if the problem persists.",
      primaryActionText: "OK",
    },
    systemErrorValidityPeriod: {
      title: "System error",
      body:
        "We could not find the validity period.\nGet new QR code from your in-charge and try again.",
      primaryActionText: "OK",
    },
    systemErrorLoginIssue: {
      title: "System error",
      body:
        "We are currently facing login issues.\nGet a new QR code from your in-charge.",
      primaryActionText: "OK",
    },
    systemErrorServerIssue: {
      title: "System error",
      body:
        "We are currently facing a server issue. Contact your in-charge if the problem persists.",
      primaryActionText: "OK",
    },
    expiredQR: {
      title: "Expired",
      body: "Get a new QR code from your in-charge.",
      primaryActionText: "OK",
    },
    expiredOTP: {
      title: "Expired",
      body: "Get a new OTP and try again.",
      primaryActionText: "OK",
    },
    invalidInputOTPOneMoreInvalid: {
      title: "Invalid input",
      body:
        "Enter OTP again. After 1 more invalid OTP entry, you will have to wait 3 minutes before trying again.",
      primaryActionText: "OK",
    },
    invalidInputIDNumber: {
      title: "Invalid input",
      body: "Enter or scan a valid ID number.",
      primaryActionText: "OK",
    },
    invalidInputQR: {
      title: "Invalid input",
      body: "Scan QR code again or get a new QR code from your in-charge.",
      primaryActionText: "OK",
    },
    invalidInputOTP: {
      title: "Invalid input",
      body: "Enter OTP again.",
      primaryActionText: "OK",
    },
    incompleteEntry: {
      title: "Incomplete entry",
      body: "Select at least one item to checkout.",
      primaryActionText: "OK",
    },
    paymentCollected: {
      title: "Payment collected?",
      body:
        "This action cannot be undone. Proceed only when payment has been collected.",
      primaryActionText: "Collected",
      secondaryActionText: "No",
    },
    outdatedAppRestart: {
      title: "Outdated app",
      body: "Restart your app to get the latest app version.",
      primaryActionText: "Restart app",
    },
    outdatedAppUpdate: {
      title: "Outdated app",
      body: "Update your app through the %{storeName}.",
      primaryActionText: "Update app",
    },
    systemError: {
      title: "System error",
      body:
        "We are currently facing connectivity issues. Try restarting the app or contact Govtech if the problem persists.",
      primaryActionText: "Restart app",
    },
    wrongFormatCountryCode: {
      title: "Wrong format",
      body: "Enter a valid country code.",
      primaryActionText: "OK",
    },
    wrongFormatCountryCodePhoneNumber: {
      title: "Wrong format",
      body: "Enter a valid country code and contact number.",
      primaryActionText: "OK",
    },
    wrongFormatQRScanAgain: {
      title: "Wrong format",
      body: "Scan QR code again or get a new QR code from your in-charge.",
      primaryActionText: "OK",
    },
    wrongFormatValidCode: {
      title: "Wrong format",
      body: "Enter valid code details.",
      primaryActionText: "OK",
    },
    wrongFormatDeviceCode: {
      title: "Wrong format",
      body: "Scan device code again or get a new device from your in-charge.",
      primaryActionText: "OK",
    },
    wrongFormatID: {
      title: "Wrong format",
      body: "Enter or scan a valid ID number.",
      primaryActionText: "OK",
    },
    wrongFormatQRGetNew: {
      title: "Wrong format",
      body: "Get a new QR code from your in-charge.",
      primaryActionText: "OK",
    },
    alreadyUsedCode: {
      title: "Already Used",
      body: "Enter unique code details",
      primaryActionText: "OK",
    },
    alreadyUsedItem: {
      title: "Already Used",
      body: "Scan another item that is not tagged to any ID number",
      primaryActionText: "OK",
    },
    wrongFormatCode: {
      title: "Wrong format",
      body: "Enter or scan valid code details",
      primaryActionText: "OK",
    },
    incompleteEntryCode: {
      title: "Incomplete entry",
      body: "Enter or scan code details",
      primaryActionText: "OK",
    },
    wrongFormatNotValidDeviceCode: {
      title: "Wrong format",
      body: "Scan valid device code",
      primaryActionText: "OK",
    },
    incompleteEntryScanDeviceCode: {
      title: "Incomplete entry",
      body: "Scan device code",
      primaryActionText: "OK",
    },
    wrongFormatContactNumber: {
      title: "Wrong format",
      body: "Enter valid contact number",
      primaryActionText: "OK",
    },
    insufficientQuota: {
      title: "Error",
      body: "Insufficient quota",
      primaryActionText: "OK",
    },
    invalidQuantity: {
      title: "Error",
      body: "Invalid quantity",
      primaryActionText: "OK",
    },
    categoryDoesNotExist: {
      title: "Error",
      body: "Category does not exist",
      primaryActionText: "OK",
    },
    systemErrorServerIssues: {
      title: "System error",
      body:
        "We are currently facing server issues. Try again later or contact your in-charge if the problem persists",
      primaryActionText: "OK",
    },
    discardTransaction: {
      title: "Discard transaction?",
      body: "This will clear all scanned items",
      primaryActionText: "Discard",
      secondaryActionText: "Cancel",
    },
    errorScanning: {
      title: "Error scanning",
      body: "Please check that the voucher code is in the correct format.",
      primaryActionText: "Continue Scanning",
    },
    scanLimitReached: {
      title: "Scan limit reached",
      primaryActionText: "OK",
    },
    removeItem: {
      title: "Remove item?",
      body: "Do you want to remove this item: %{voucherSerial}?",
      primaryActionText: "Cancel",
      secondaryActionText: "Remove",
    },
    checkIdFormat: {
      title: "Invalid input",
      body: "Please check that the ID is in the correct format",
      primaryActionText: "OK",
    },
    notEligible: {
      title: "Not eligible",
      body: "Please log an appeal request.",
      primaryActionText: "OK",
    },
    invalidMerchantCode: {
      title: "Error",
      body: "Invalid merchant code",
      primaryActionText: "OK",
    },
    removeVoucher: {
      title: "Remove item?",
      body: "Do you want to remove this item: %{voucherSerial}?",
      primaryActionText: "Remove",
      secondaryActionText: "Cancel",
    },
  },
};
