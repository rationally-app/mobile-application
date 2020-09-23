import { Translations } from "./type";

export const zh: Translations = {
  loginScanCard: {
    loginWithQR: "请使用您专属的QR码登录",
    scanToLogin: "扫描QR码",
    needHelp: "需要协助？",
    askQuestion: "问问题"
  },
  loginMobileNumberCard: {
    enterMobileNumber: "请输入您的手机号码，获取一次性密码",
    mobileNumber: "手机号码",
    sendOtp: "发送一次性密码"
  },
  loginOTPCard: {
    sendingOtp: "一次性密码发送中...",
    otp: "一次性密码",
    resendIn: "在%{ss}秒内重新发送",
    submit: "提交",
    resend: "重新发送"
  },
  collectCustomerDetailsScreen: {
    checkEligibleItems: "查看可领取的物品数量",
    scanIdentification: "扫描证件",
    or: "或",
    enterIdNumber: "输入证件号码",
    check: "查看"
  },
  idScanner: {
    enterIdManually: "输入证件号码",
    enterManually: "自己输入",
    enterVoucherId: "输入优惠券编号",
    scanToCheck: "扫描优惠券"
  },
  navigationDrawer: {
    logout: "登出",
    addCampaign: "添加活动",
    selectCampaign: "选活动",
    changeChampaign: "更改活动",
    helpSupport: "支援服务",
    termsOfUse: "使用条款",
    privacyStatement: "隐私声明",
    reportVulnerability: "报告漏洞"
  },
  customerQuotaScreen: {
    campaignExpiredOn: "在 %{dateTime} 已到期",
    campaignValidTo: "有效期至 %{dateTime}",
    quotaRedeemedLimitReachedIDNumber: "证件号码",
    quotaLimitMax: "最多",
    quotaAppealCancel: "取消",
    quotaButtonCheckout: "确认交易",
    quotaButtonAdd: "+ 添加",
    quotaAddId: "输入另一个证件号码已增加限额",
    quotaIdentifierButtonScan: "扫描",
    quotaScanButtonBack: "返回",
    quotaCheck: "检查中"
  },
  merchantFlowScreen: {
    quotaButtonAddVoucher: "添加优惠券",
    quotaCategoryVouchers: "优惠券",
    merchantCode: "商人编号"
  },
  checkoutSuccessScreen: {
    redeemed: "已领取!",
    redeemedItems: "已领取物品：",
    redeemedNextIdentity: "下一个证件",
    purchased: "已购买!",
    purchasedItems: "已购买物品：",
    purchasedNextIdentity: "下一个证件",
    previouslyRedeemedItems: "已领取物品：",
    previouslyPurchasedItems: "已购买物品：",
    redeemedAgo: "在 %{time} 已领取",
    redeemedOn: "在 %{time} 已领取",
    previouslyRedeemed: "已领取过",
    showMore: "显示更多内容",
    showLess: "隐藏内容",
    today: " 今天。",
    limitReachedRecent: "%{time} 前达到领取限额",
    limitReachedDate: "在 %{dateTime} 达到领取限额",
    limitReached: "达到领取限额",
    redeemedLimitReached: "到 %{date} 为止还有%{quantity}件物品",
    valid: "有效",
    complete: "确认交易"
  },
  customerAppealScreen: {
    raiseAppeal: "提出上诉",
    indicateReason: "说明上诉理由"
  },
  statisticsScreen: {
    distributedAmount: "您已分发%{amount}",
    lastDistributedTiming: "最后在 %{dateTime} 分发",
    viaAppeal: "通过上诉"
  },
  notEligibleScreen: {
    notEligible: "不符合资格",
    logAppeal: "请提出上诉。"
  }
};
