import { Translations } from "./type";

export const en: Translations = {
  loginScanCard: {
    loginWithQR:
      "Please log in with your unique QR code provided by your supervisor",
    scanToLogin: "Scan to login",
    needHelp: "Need help",
    askQuestion: "Ask a question"
  },
  loginMobileNumberCard: {
    enterMobileNumber:
      "Please enter your mobile phone number to receive a one-time password.",
    mobileNumber: "Mobile phone number",
    sendOtp: "Send OTP"
  },
  loginOTPCard: {
    sendingOtp: "We're sending you the one-time password",
    otp: "OTP",
    resendIn: "Resend in %{ss}s",
    submit: "Submit",
    resend: "Resend"
  },
  collectCustomerDetailsScreen: {
    checkEligibleItems: "Check the number of item(s) eligible for redemption",
    scanIdentification: "Scan identification",
    or: "Or",
    enterIdNumber: "Enter ID Number",
    check: "Check"
  },
  idScanner: {
    enterIdManually: "Enter ID manually",
    enterManually: "Enter manually",
    enterVoucherId: "Enter voucher ID",
    scanToCheck: "Scan to check validity",
    continueScanning: "Continue scanning"
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
    reportVulnerability: "Report Vulnerability"
  },
  customerQuotaScreen: {
    campaignExpiredOn: "Expired on %{dateTime}",
    campaignValidTo: "Valid till %{dateTime}",
    IDNumber: "Identification number",
    IDNumbers: "Identification numbers",
    quotaLimitMax: "Max",
    quotaAppealCancel: "Cancel",
    quotaButtonCheckout: "Checkout",
    quotaButtonAdd: "Add",
    quotaAddId: "Add another ID to combine customer quotas",
    quotaIdentifierButtonScan: "Scan",
    quotaScanButtonBack: "Back",
    quotaCheck: "Checking",
    id: "ID"
  },
  merchantFlowScreen: {
    quotaButtonAddVoucher: "Add voucher",
    quotaCategoryVouchers: "Voucher(s)",
    merchantCode: "Merchant Code",
    seeAll: "See all",
    nextMerchant: "Next merchant",
    remove: "Remove"
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
    limitReachedRecent: "Limit reached %{time} ago",
    limitReachedDate: "Limit reached on %{dateTime}",
    limitReached: "Limit reached",
    redeemedLimitReached: "%{quantity} item(s) more till %{date}",
    valid: "Valid",
    complete: "Complete",
    quantity: "qty"
  },
  customerAppealScreen: {
    raiseAppeal: "Raise an appeal",
    indicateReason: "Indicate reason for appeal"
  },
  statisticsScreen: {
    distributedAmount: "You have distributed %{quantity}",
    lastDistributedTiming: "Last distributed at %{dateTime}",
    viaAppeal: "via appeal"
  },
  notEligibleScreen: {
    notEligible: "Not eligible",
    logAppeal: "Please log an appeal request",
    cannot: "Cannot",
    purchase: "purchase"
  }
};
