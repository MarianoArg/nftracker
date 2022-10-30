# NFTracker

![NFTracker](https://user-images.githubusercontent.com/10810691/198905991-a95a1101-38b3-4549-a870-6451e99bd293.png)
Go and try the live version of [NFTracker](https://nftracker.fly.dev/).

## Intro

This is project is the resolution of the [frontend takehome](https://github.com/pixeldaogg/frontend-takehome) for Pixel.
This project was bootstrapped with the [Blues Stack](https://github.com/remix-run/blues-stack) by Remix.

## What's in the stack

Besides the [original Remix stack](https://github.com/remix-run/blues-stack#whats-in-the-stack), this project is using:

- [RainbowKit](https://www.rainbowkit.com/) and [Wagmi](https://wagmi.sh/) for wallet connection handle.
- [RadixUI](https://www.radix-ui.com/) for complex components.
- [dnd-kit](https://dndkit.com/) for Drag & Drop functionallity
- [SIWE](https://github.com/spruceid/siwe) for manage user sessions based on wallet connection.
- [React Icons](https://react-icons.github.io/react-icons/) for easy-use icons
- [SWR](https://swr.vercel.app/) for API pagination hooks
- [Reservoir](https://docs.reservoir.tools/docs) for NFT APIs

## Why this stack?

[Remix](https://remix.run/) is one of the most popular full-stack web frameworks nowadays. I never had a chance of trying it before, so I used this takefom as an oportunity to discover it. But this desition has it outcomes, every example and documentation of the Web3 tools used in this project was focused on NextJs, so some research was needed to make these tools to work.

Before this project, I had no idea at all (and I still don't lol) about Web3 and the tools used on these kind of projects, so after some research I found [RainbowKit](https://www.rainbowkit.com/) and [Wagmi](https://wagmi.sh/) as some standars, and after some pitfalls I found the final results decent enough for this small demo.

In regards to the **drag-&-drop** functionallity, I find [dnd-kit](https://dndkit.com/) as the way to go nowadays, I used it before in some demos as well as in the last project I worked, with amazing results. So no doubt on what to use for this feature.

[SWR](https://swr.vercel.app/) and [Radix](https://www.radix-ui.com/) were already part the Web3 tools dependencies used in this project, so I took advantage of those which are amazing tools and were a good fit for what I needed for this small project.

#### What about the design?

I used the [original wireframes in the takehome description](https://github.com/pixeldaogg/frontend-takehome) as a base, and added some styles over them. For this I did some research on web3 sites to understand a bit more about the patters used.

## Development

- Clone this repo and install its dependencies

  ```sh
  npm install
  ```

- Start the Postgres Database in [Docker](https://www.docker.com/get-started):

  ```sh
  npm run docker
  ```

  > **Note:** The npm script will complete while Docker sets up the container in the background. Ensure that Docker has finished and your container is running before proceeding.

- Initial setup:

  ```sh
  npm run setup
  ```

- Run the first build:

  ```sh
  npm run build
  ```

- Start dev server:

  ```sh
  npm run dev
  ```

This starts the app in development mode, rebuilding assets on file changes.

If you'd prefer not to use Docker, you can also use Fly's Wireguard VPN to connect to a development database (or even your production database). You can find the instructions to set up Wireguard [here](https://fly.io/docs/reference/private-networking/#install-your-wireguard-app), and the instructions for creating a development database [here](https://fly.io/docs/reference/postgres/).

### Relevant code:

This is a very simple platform that intends to help users group tokens into one Custom Collection that can be followed and monitored. The main functionality is logging it with your Etherum wallet, selecting any NFT collection you want, and pick the relevant tokens you would like to keep track of, creating custom collections. Collections can be updated and deleted at any time.

- creating users and updating [./app/models/user.server.ts](./app/models/user.server.ts)
- user sessions, and verifying them [./app/session.server.ts](./app/session.server.ts)
- creating, deleting and updating collections [./app/models/collection.server.ts](./app/models/collection.server.ts)

## GitHub Actions

This project uses GitHub Actions for continuous integration and deployment. Anything that gets into the `main` branch will be deployed to production after running tests/build/etc.

### Testing

This is a very simple app where most of the code belongs to libs already tested. Having said this, I do consider adding some e2e tests for the collections flows. My plan is to add some in the upcoming days (I ran out of time for personal reasons).

- WIP e2e tests

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.
