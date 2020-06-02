[![CircleCI](https://circleci.com/gh/rationally-app/mobile-application.svg?style=svg)](https://circleci.com/gh/rationally-app/mobile-application)

# SupplyAlly

SupplyAlly helps ensure that everyone can get their fair share of items. By scanning a person's ID, you'll be able to track whether his allocated quota has been used up.

## Development

1. Setup [Sentry](https://sentry.io/). Copy `.env.example` to `.env` and populate with your values. You can skip this step if you don't want to use Sentry to track app errors.
2. Install [`expo-cli`](https://docs.expo.io/workflow/expo-cli/) globally
3. Login to Expo using `expo login`. Ask someone for the credentials.
4. Install Expo on your mobile device and/or simulator and login with the same account. When using a mobile device for testing, [it needs to be on the same network.](https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet)
5. Install dependencies: `npm install`
6. Run one of the following to start development:
   - `npm run start`
   - `npm run start:mock`: If you'd like to mock the APIs
   - `npm run storybook`: If you'd like to use Storybook for development
7. Open Expo and launch the app

## Testing

```
npm run test
npm run test:watch // If you'd like to test specific files
```

## CI/CD

We use CircleCI and have supplied the `config.yml` for setting it up. You will need to add the following environment variables to CircleCI:

```
EXPO_CLI_PASSWORD
EXPO_USERNAME
GITHUB_ACCESS_TOKEN_COMMENTER
SENTRY_AUTH_TOKEN
SENTRY_DSN
SENTRY_ORG
SENTRY_PROJECT
```

## Deployed Application

![Expo QR](https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=exp://exp.host/@musket/rationally)
