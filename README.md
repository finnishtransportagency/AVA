# Finnish Transport Infrastructure Agency - Forwarding service for open data

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## How to develop locally


Prerequisites:
- [Node.js](https://nodejs.org/en/) v14.15.1 or greater
- [yarn](https://yarnpkg.com/) package manager

Go to the project root and install dependencies

```bash
yarn install
```

Start the development server
```bash
yarn start
```

The application should open to [http://localhost:3000](http://localhost:3000)

## Create a production build

Run one of the following scripts depending on the target environment.

```bash
yarn run build:dev
yarn run build:test
yarn run build:prod
```

This will bundle the assets to a `build` folder in the project root. Copy the assets in the build folder to wherever the application will be served from.

## Development setup

For the development environment to work correctly, you must add
`REACT_APP_FOLDERS_URL=https://api.testivaylapilvi.fi/ava/hakemisto/` to your `.env` if it doesn't already exist.
