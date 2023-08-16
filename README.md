# Spongly-dapp

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Installation

Before you start, please make sure you have installed:

- Node.js >= 16.13.0
- npm >= 8.0.0

To install the project, run:

```npm install```

## Usage
Before running the application, you will need to generate tokens for application color palette

```npm run generate-tokens```

To start the development server, run:
```npm run dev```

This will start the development server at http://localhost:4001/. You can view the app in the browser.

To build the project, run:

```npm run build```

After successful build you can run

```npm run start```

This will start server at http://localhost:8000/. You can view the app in the browser.

To build project for IPFS run

```npm run build-ipfs```

After successful build you to run, you will beed to set variable PORT in the ```.env```

```npm run start-ipfs```

This will start server at http://localhost:${PORT}/. You can view the app in the browser.
