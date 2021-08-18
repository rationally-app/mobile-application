![Deploy Staging](https://github.com/rationally-app/mobile-application/workflows/Deploy%20Staging/badge.svg) ![Create Release](https://github.com/rationally-app/mobile-application/workflows/Create%20Release/badge.svg)

# SupplyAlly

SupplyAlly helps ensure that everyone can get their fair share of items. By scanning a person's ID, you'll be able to track whether his allocated quota has been used up.

## Deployed Staging Application

![Expo Staging QR](https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=exp://exp.host/@supplyallytest/rationally?release-channel=staging)

## Development

1. Setup [Sentry](https://sentry.io/). Copy `.env.example` to `.env` and populate with your values. You can skip this step if you don't want to use Sentry to track app errors.
2. Install [`expo-cli`](https://docs.expo.io/workflow/expo-cli/) globally
3. Login to Expo using `expo login`. Ask someone for the credentials.
4. Install Expo on your mobile device and/or simulator and login with the same account. When using a mobile device for testing, [it needs to be on the same network.](https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet)
5. Install dependencies: `npm install`
6. This step only applies if you are on a windows machine. If not, skip this step.
   - open `package.json` and replace the `scripts` object with the following:

```json
{
  "start": "set APP_BUILD_VERSION=1 && set APP_BINARY_VERSION=dev && set START_STORYBOOK=false && expo start",
  "start:mock": "set APP_BUILD_VERSION=1 && set APP_BINARY_VERSION=dev && set MOCK=true && expo start",
  "test": "jest",
  "test:coverage": "npm run test -- --coverage",
  "test:watch": "jest --watch",
  "storybook": "set APP_BUILD_VERSION=1 && set APP_BINARY_VERSION=dev && set START_STORYBOOK=true && expo start",
  "android": "set APP_BUILD_VERSION=1 && set APP_BINARY_VERSION=dev && expo start --android",
  "ios": "set APP_BUILD_VERSION=1 && set APP_BINARY_VERSION=dev && expo start --ios",
  "web": "expo start --web",
  "eject": "expo eject",
  "lint": "eslint . --ext .ts,.tsx,.mdx --max-warnings 0",
  "lint:fix": "npm run lint -- --fix"
}
```

7. Run one of the following to start development:
   - `npm run start`
   - `npm run start:mock`: If you'd like to mock the APIs
   - `npm run storybook`: If you'd like to use Storybook for development
8. Open Expo and launch the app

9. To fix the network issues on expo app in terms of backend api not reachable :

   - import deleteStoreInBuckets from src/utils/bucketStorageHelper.ts
   - to replace useEffect hook in `authStore.tsx`.
   - then refresh the app. it will show the login screen
   - after everything is done revert all changes in `authStore.tsx`.

   ```
   import {deleteStoreInBuckets} from "../utils/bucketStorageHelper";

   useEffect(() => {
    if (hasLoadedFromPrimaryStore) {
      const authCredentialsString = JSON.stringify(authCredentials);
      const prevAuthCredentialsString = JSON.stringify(prevAuthCredentials);
      // do a top level check to see if there are any changes
      if (authCredentialsString) {
        deleteStoreInBuckets(AUTH_CREDENTIALS_STORE_KEY, authCredentialsString);
      }
    }
   }, [hasLoadedFromPrimaryStore, authCredentials, prevAuthCredentials]);
   ```

## Testing

```
npm run test
npm run test:watch // If you'd like to test specific files
```

## CI/CD

We use Github Actions and have supplied the `.gihthub/workflows` for setting it up. You will need to add the following secrets to the Github Repo:

```
EXPO_CLI_PROD_USERNAME
EXPO_CLI_PROD_PASSWORD
EXPO_CLI_TEST_USERNAME
EXPO_CLI_TEST_PASSWORD

```

You will also need to define the following environment variables in a .env file (please refer to .env.example):

```
SENTRY_ORG: the slug of the organisation to use for a command
SENTRY_PROJECT: the slug of the project to use for a command
SENTRY_AUTH_TOKEN: the authentication token to use for all communication with Sentry
SENTRY_DSN: the DSN to use to connect to sentry

DOMAIN_FORMAT: to validate backend endpoints
```

If you're releasing this for the first time, you need to create a tag to specify the initial version of the app. This allows the changelog generator to generate the correct set of changes. A `base-ref` property will then need to be created in the changelog generator's `with` parameter. Once released, this property can be removed.

```
uses: metcalfc/changelog-generator@v0.4.0
with:
   myToken: ${{ secrets.GITHUB_TOKEN }}
   base-ref: <base-tag> # e.g. prod-0
```
