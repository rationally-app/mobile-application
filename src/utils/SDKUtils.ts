import ScanbotSDK from 'react-native-scanbot-sdk/src';

export class SDKUtils {
  /*
   * TODO Add the Scanbot SDK license key here.
   * Please note: The Scanbot SDK will run without a license key for one minute per session!
   * After the trial period is over all Scanbot SDK functions as well as the UI components will stop working
   * or may be terminated. You can get an unrestricted "no-strings-attached" 30 day trial license key for free.
   * Please submit the trial license form (https://scanbot.io/en/sdk/demo/trial) on our website by using
   * the app identifier "io.scanbot.example.sdk.reactnative" of this example app.
   */
  static readonly SDK_LICENSE_KEY: string = "LM0w+onHMzfXHgN2f7Vpkh5YA4Zq2K" +
    "QorFC9da8tsGYToBb+WWUXY1fFQDM0" +
    "LStr3zMa5ZYpt3FfpOtl/V+gqCq08p" +
    "Omp0ArqEoloSzB7XtxdrZmqWdX/K63" +
    "QfrjhwR4gjrL63KcX6VGDl0dbi+VXn" +
    "2W6fj7RkPEg0tl3uaoVstepHSXoHDb" +
    "HF/R8jieLj+6Wt6bManJytowdmRzM6" +
    "vQRJZ8mszY7QUZrGzjcle/UCexweGn" +
    "HnYndPRzgq5ihKC5iDm2wnl2wUqgxu" +
    "aRjcU7U3cunS8QveV061TB1r8pfvUG" +
    "VdAoBQJnYK7u3+7H3tBwpEbXKZfZyi" +
    "rgdn/7PVhXTA==\nU2NhbmJvdFNESw" +
    "pzZy5nb3YudGVjaC5tdXNrZXQKMTYw" +
    "NDEwMjM5OQoxMTU1Njc4CjM=\n";

  public static async checkLicense(): Promise<boolean> {
    const info = await ScanbotSDK.getLicenseInfo();
    if (info.isLicenseValid) {
      // OK - we have a trial session, a valid trial license or valid production license.
      return true;
    }
    // @ts-ignore
    // eslint-disable-next-line no-alert
    alert('Scanbot SDK trial period or license has expired!', 500);
    return false;
  }
}