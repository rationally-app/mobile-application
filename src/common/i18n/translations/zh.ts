import { Translations } from "./type";

export const zh: Translations = {
  loginScanCard: {
    loginWithQR: "请使用您专属的QR码登录",
    scanToLogin: "扫描QR码",
    needHelp: "需要协助",
    askQuestion: "问问题"
  },
  loginMobileNumberCard: {
    enterMobileNumber: "请输入您的手机号码，获取一次性密码",
    mobileNumber: "手机号码",
    sendOtp: "发送一次性密码"
  },
  loginOTPCard: {
    sendingOtp: "一次性密码发送中",
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
    scanToCheck: "扫描优惠券",
    continueScanning: "继续扫描"
  },
  navigationDrawer: {
    logout: "登出",
    campaign: "活动",
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
    idNumber: "证件号码",
    idNumbers: "证件号码",
    quotaLimitMax: "最多",
    quotaAppealCancel: "取消",
    quotaButtonCheckout: "确认交易",
    quotaButtonAdd: "添加",
    quotaAddId: "输入另一个证件号码已增加限额",
    quotaIdentifierButtonScan: "扫描",
    quotaScanButtonBack: "返回",
    quotaCheck: "检查中",
    id: "编号"
  },
  merchantFlowScreen: {
    quotaButtonAddVoucher: "添加优惠券",
    quotaCategoryVouchers: "优惠券",
    merchantCode: "商人编号",
    seeAll: "查看所有",
    nextMerchant: "下一个商人",
    remove: "清除"
  },
  checkoutSuccessScreen: {
    redeemed: "已领取",
    redeemedItems: "已领取物品",
    redeemedNextIdentity: "下一个证件",
    purchased: "已购买",
    purchasedItems: "已购买物品",
    purchasedNextIdentity: "下一个证件",
    previouslyRedeemedItems: "已领取物品",
    previouslyPurchasedItems: "已购买物品",
    redeemedAgo: "在 %{time} 已领取",
    redeemedOn: "在 %{time} 已领取",
    previouslyRedeemed: "已领取过",
    showMore: "显示更多内容",
    showLess: "隐藏内容",
    today: "今天的",
    limitReachedRecent: "%{time} 前达到%{today}领取限额。",
    limitReachedDate: "在 %{dateTime} 达到%{today}领取限额。",
    limitReached: "达到%{today}领取限额。",
    redeemedLimitReached: "到 %{date} 为止还有%{quantity}件物品。",
    valid: "有效",
    complete: "确认交易",
    quantity: "个"
  },
  customerAppealScreen: {
    raiseAppeal: "提出上诉",
    indicateReason: "说明上诉理由"
  },
  statisticsScreen: {
    distributedAmount: "您已分发%{quantity}",
    lastDistributedTiming: "最后在 %{dateTime} 分发",
    viaAppeal: "通过上诉"
  },
  notEligibleScreen: {
    notEligible: "不符合资格",
    logAppeal: "请提出上诉",
    cannot: "不能",
    purchase: "购买"
  },
  errorMessages: {
    alreadyUsedDifferentIDNumber: {
      title: "已使用",
      body: "请输入或扫描另一个证件号码。",
      primaryActionText: "确定"
    },
    alreadyUsedQRCode: {
      title: "已使用",
      body: "请向负责人索取没有与任何联络号码挂钩的新QR码。",
      primaryActionText: "确定"
    },
    disabledAccess: {
      title: "无法进入",
      body: "请在 %{minutes} 分钟后再试。",
      primaryActionText: "确定"
    },
    cancelEntry: {
      title: "删除所输入的资料并扫描另一个证件号码？",
      primaryActionText: "删除资料",
      secondaryActionText: "保留"
    },
    confirmLogout: {
      title: "确定登出？",
      primaryActionText: "登出",
      secondaryActionText: "不是"
    },
    incompleteEntryYourContactNumber: {
      title: "资料输入不完整",
      body: "请输入您的联络号码。",
      primaryActionText: "确定"
    },
    incompleteEntryVoucherCode: {
      title: "资料输入不完整",
      body: "请输入优惠券编号。",
      primaryActionText: "确定"
    },
    incompleteEntryDeviceCode: {
      title: "资料输入不完整",
      body: "请输入配备编号。",
      primaryActionText: "确定"
    },
    incompleteEntryContactNumber: {
      title: "资料输入不完整",
      body: "请输入联络号码。",
      primaryActionText: "确定"
    },
    incompleteEntrySelectCheckbox: {
      title: "资料输入不完整",
      body: "请选择复选框。",
      primaryActionText: "确定"
    },
    resendOTP: {
      title: "重新发送一次性密码？",
      body: "若再要求发送一次性密码，您须等待3分钟才能再试。",
      primaryActionText: "重新发送",
      secondaryActionText: "不须要"
    },
    systemErrorConnectivityIssues: {
      title: "连接目前出现问题。",
      body:
        "连接目前出现问题。\n请稍后再试。如果问题持续出现，请联系您的负责人。",
      primaryActionText: "确定"
    },
    systemErrorValidityPeriod: {
      title: "系统错误",
      body: "我们找不到有效期限。\n请向您的负责人索取新QR码后再试一次。",
      primaryActionText: "确定"
    },
    systemErrorLoginIssue: {
      title: "系统错误",
      body: "登录目前出现问题。\n请向您的负责人索取新QR码。",
      primaryActionText: "确定"
    },
    systemErrorServerIssue: {
      title: "系统错误",
      body: "服务器目前出现问题。如果问题持续出现，请联系您的负责人。",
      primaryActionText: "确定"
    },
    expiredQR: {
      title: "过期",
      body: "请向您的负责人索取新QR码。",
      primaryActionText: "确定"
    },
    expiredOTP: {
      title: "过期",
      body: "获取新的一次性密码后再试一次。",
      primaryActionText: "确定"
    },
    invalidInputOTPOneMoreInvalid: {
      title: "输入无效",
      body:
        "请再次输入一次性密码。若再输入无效的一次性密码，您须等待3分钟才能再试。",
      primaryActionText: "确定"
    },
    invalidInputIDNumber: {
      title: "输入无效",
      body: "请输入或扫描有效的证件号码。",
      primaryActionText: "确定"
    },
    invalidInputQR: {
      title: "输入无效",
      body: "请再次扫描QR码或向您的负责人索取新QR码。",
      primaryActionText: "确定"
    },
    invalidInputOTP: {
      title: "输入无效",
      body: "请再次输入一次性密码。",
      primaryActionText: "确定"
    },
    incompleteEntry: {
      title: "资料输入不完整",
      body: "请选择至少一件物品才能完成交易。",
      primaryActionText: "确定"
    },
    paymentCollected: {
      title: "收到款项了吗？",
      body: "此行动不能撤销。只有收到款项后才能继续。",
      primaryActionText: "已收",
      secondaryActionText: "未收"
    },
    outdatedAppRestart: {
      title: "应用程序版本已过期",
      body: "请重启应用程序，以下载最新版本。",
      primaryActionText: "重启应用程序"
    },
    outdatedAppUpdate: {
      title: "应用程序版本已过期",
      body: "请通过[谷歌应用商店/苹果应用商店]更新应用程序。",
      primaryActionText: "更新应用程序"
    },
    systemError: {
      title: "系统错误",
      body:
        "连接目前出现问题。请重启应用程序。如果问题持续出现，请联系政府科技局。",
      primaryActionText: "重启应用程序"
    },
    wrongFormatCountryCode: {
      title: "格式错误",
      body: "请输入有效的国家代码。",
      primaryActionText: "确定"
    },
    wrongFormatCountryCodePhoneNumber: {
      title: "格式错误",
      body: "请输入有效的国家代码和联络号码。",
      primaryActionText: "确定"
    },
    wrongFormatQRScanAgain: {
      title: "格式错误",
      body: "请再次扫描QR码或向您的负责人索取新QR码。",
      primaryActionText: "确定"
    },
    wrongFormatValidCode: {
      title: "格式错误",
      body: "请输入有效的编号。",
      primaryActionText: "确定"
    },
    wrongFormatDeviceCode: {
      title: "格式错误",
      body: "请再次扫描配备编号或向您的负责人索取新配备。",
      primaryActionText: "确定"
    },
    wrongFormatID: {
      title: "格式错误",
      body: "请输入或扫描有效的证件号码。",
      primaryActionText: "确定"
    },
    wrongFormatQRGetNew: {
      title: "格式错误",
      body: "请向您的负责人索取新QR码。",
      primaryActionText: "确定"
    },
    alreadyUsedCode: {
      title: "已使用",
      body: "请输入独特的编号。",
      primaryActionText: "确定"
    },
    alreadyUsedItem: {
      title: "已使用",
      body: "请扫描另一件没有与任何证件号码挂钩的物品。",
      primaryActionText: "确定"
    },
    wrongFormatCode: {
      title: "格式错误",
      body: "请输入或扫描有效的编号。",
      primaryActionText: "确定"
    },
    incompleteEntryCode: {
      title: "资料输入不完整",
      body: "请输入或扫描编号。",
      primaryActionText: "确定"
    },
    wrongFormatNotValidDeviceCode: {
      title: "格式错误",
      body: "请扫描有效的配备编号。",
      primaryActionText: "确定"
    },
    incompleteEntryScanDeviceCode: {
      title: "资料输入不完整",
      body: "请扫描配备编号。",
      primaryActionText: "确定"
    },
    wrongFormatContactNumber: {
      title: "格式错误",
      body: "请输入有效的联络号码。",
      primaryActionText: "确定"
    },
    insufficientQuota: {
      title: "错误",
      body: "限额不足",
      primaryActionText: "确定"
    },
    invalidQuantity: {
      title: "错误",
      body: "数量无效",
      primaryActionText: "确定"
    },
    categoryDoesNotExist: {
      title: "错误",
      body: "找不到物品类别",
      primaryActionText: "确定"
    },
    systemErrorServerIssues: {
      title: "系统错误",
      body: "服务器目前出现问题。如果问题持续出现，请联系您的负责人。",
      primaryActionText: "确定"
    },
    discardTransaction: {
      title: "清除交易?",
      body: "已扫描的物品将会被清除。",
      primaryActionText: "清除",
      secondaryActionText: "取消"
    },
    errorScanning: {
      title: "扫描失败",
      body: "请检查优惠券编号格式合正确",
      primaryActionText: "继续扫描"
    },
    scanLimitReached: {
      title: "达到扫描限额",
      primaryActionText: "确定"
    },
    removeItem: {
      title: "清除物品?",
      body: "您要清除 %{voucherSerial} 吗?",
      primaryActionText: "取消",
      secondaryActionText: "清除"
    },
    checkIdFormat: {
      title: "输入无效",
      body: "请检查证件号码格式合正确",
      primaryActionText: "确定"
    },
    notEligible: {
      title: "不符合资格",
      body: "请提出上诉。",
      primaryActionText: "确定"
    },
    invalidMerchantCode: {
      title: "错误",
      body: "商家代码无效",
      primaryActionText: "确定"
    },
    removeVoucher: {
      title: "清除物品?",
      body: "您要清除%{voucherSerial}吗?",
      primaryActionText: "清除",
      secondaryActionText: "取消"
    }
  }
};
