const appBuildVersion = process.env.APP_BUILD_VERSION || 0;

export default {
  expo: {
    name: "SupplyAlly",
    slug: "rationally",
    privacy: "public",
    sdkVersion: "35.0.0",
    platforms: ["ios", "android", "web"],
    version: "3.6.1",
    orientation: "portrait",
    scheme: "supplyally",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splashscreen.png",
      resizeMode: "contain",
      backgroundColor: "#F1FAFA"
    },
    extra: {
      appBuildVersion
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      buildNumber: "1",
      supportsTablet: true,
      bundleIdentifier: "sg.gov.tech.musket",
      splash: {
        image: "./assets/splashscreen.png",
        tabletImage: "./assets/splashscreen-tablet.png",
        backgroundColor: "#F1FAFA"
      },
      infoPlist: {
        NSCameraUsageDescription:
          "SupplyAlly requires access to your camera to scan QR codes/barcodes.",
        NSPhotoLibraryUsageDescription:
          "This permission is not needed by the app, but it is required by an underlying API. If you see this dialog, contact us.",
        NSPhotoLibraryAddUsageDescription:
          "This permission is not needed by the app, but it is required by an underlying API. If you see this dialog, contact us.",
        NSLocationWhenInUseUsageDescription:
          "This permission is not needed by the app, but it is required by an underlying API. If you see this dialog, contact us.",
        NSLocationAlwaysUsageDescription:
          "This permission is not needed by the app, but it is required by an underlying API. If you see this dialog, contact us.",
        NSLocationAlwaysAndWhenInUseUsageDescription:
          "This permission is not needed by the app, but it is required by an underlying API. If you see this dialog, contact us.",
        NSLocationUsageDescription:
          "This permission is not needed by the app, but it is required by an underlying API. If you see this dialog, contact us.",
        NSCalendarsUsageDescription:
          "This permission is not needed by the app, but it is required by an underlying API. If you see this dialog, contact us.",
        NSContactsUsageDescription:
          "This permission is not needed by the app, but it is required by an underlying API. If you see this dialog, contact us.",
        NSMicrophoneUsageDescription:
          "This permission is not needed by the app, but it is required by an underlying API. If you see this dialog, contact us.",
        NSMotionUsageDescription:
          "This permission is not needed by the app, but it is required by an underlying API. If you see this dialog, contact us.",
        NSRemindersUsageDescription:
          "This permission is not needed by the app, but it is required by an underlying API. If you see this dialog, contact us."
      }
    },
    android: {
      versionCode: 38,
      package: "sg.gov.tech.musket"
    },
    packagerOpts: {
      config: "metro.config.js",
      sourceExts: ["js", "jsx", "ts", "tsx", "svg"]
    },
    hooks: {
      postPublish: [
        {
          file: "sentry-expo/upload-sourcemaps",
          config: {
            organization: "",
            project: "",
            authToken: ""
          }
        }
      ]
    }
  }
};
