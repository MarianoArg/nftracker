import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import { getEnv } from "./env.server";
import NavBar from "~/components/NavBar";
import { ReservoirKitProvider, darkTheme } from "@reservoir0x/reservoir-kit-ui";

import {
  WagmiConfig,
  createClient,
  chain,
  configureChains,
  allChains,
  chainId,
} from "wagmi";
import { GlobalStateProvider } from "~/context";
import rainbowKitStyles from "@rainbow-me/rainbowkit/styles.css";

import type { AuthenticationStatus } from "@rainbow-me/rainbowkit";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme as rainbowKitDarkTheme,
} from "@rainbow-me/rainbowkit";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { RainbowKitAuthProvider } from "./rainbowKitAuthProvider";
import { getUserAddress } from "./session.server";
import Footer from "~/components/Footer";
import { ToastProvider } from "~/components/Toast";
import React from "react";
import * as gtag from "./gtags.client";

export const links: LinksFunction = () => {
  return [
    { rel: "preload", href: rainbowKitStyles, as: "style" },
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: rainbowKitStyles },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "NFTracker",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  const address = await getUserAddress(request);

  return json({
    ENV: getEnv(),
    status: address ? "authenticated" : "unauthenticated",
  });
}

const theme = darkTheme({
  headlineFont: "Sans Serif",
  font: "Serif",
  primaryColor: "#323aa8",
  primaryHoverColor: "#252ea5",
});

export default function App() {
  const { ENV, status } = useLoaderData<typeof loader>();
  const location = useLocation();

  const gaTrackingId = ENV.GA_TRACKING_ID;

  // Remix modules cannot have side effects so the initialization of `wagmi`
  // client happens during render, but the result is cached via `useState`
  // and a lazy initialization function.
  // See: https://remix.run/docs/en/v1/guides/constraints#no-module-side-effects
  const [{ wagmiClient, chains }] = React.useState(() => {
    const testChains =
      ENV.PUBLIC_ENABLE_TESTNETS === "true"
        ? [chain.goerli, chain.kovan, chain.rinkeby, chain.ropsten]
        : [];

    // Set up chains
    const { chains, provider } = configureChains(
      [
        chain.mainnet,
        chain.polygon,
        chain.optimism,
        chain.arbitrum,
        ...testChains,
      ],
      [
        ...(ENV.ALCHEMY_API_KEY
          ? [alchemyProvider({ apiKey: ENV.ALCHEMY_API_KEY })]
          : []),
        publicProvider(),
      ]
    );

    // Set up connectors
    const { connectors } = getDefaultWallets({
      appName: "NFTracker",
      chains,
    });

    const wagmiClient = createClient({
      autoConnect: true,
      provider,
      connectors,
    });

    return {
      wagmiClient,
      chains,
    };
  });

  React.useEffect(() => {
    if (gaTrackingId?.length) {
      gtag.pageview(location.pathname, gaTrackingId);
    }
  }, [location, gaTrackingId]);

  return (
    <html lang="en" className="h-full">
      <head>
        <Meta />
        <Links />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Righteous&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-primary-blue font-righteous">
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        {process.env.NODE_ENV === "development" || !gaTrackingId ? null : (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
            />
            <script
              async
              id="gtag-init"
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaTrackingId}', {
                  page_path: window.location.pathname,
                });
              `,
              }}
            />
          </>
        )}
        <GlobalStateProvider>
          <ToastProvider>
            <ReservoirKitProvider
              options={{
                apiBase:
                  ENV.RESERVOIR_BASE_URL ?? "https://api.reservoir.tools",
                apiKey: ENV.RESERVOIR_API_KEY,
                disablePoweredByReservoir: true,
              }}
              theme={theme}
            >
              <WagmiConfig client={wagmiClient}>
                <RainbowKitAuthProvider status={status as AuthenticationStatus}>
                  <RainbowKitProvider
                    chains={chains}
                    theme={rainbowKitDarkTheme()}
                    modalSize="compact"
                  >
                    <NavBar />
                    <Outlet />
                    <Footer />
                  </RainbowKitProvider>
                </RainbowKitAuthProvider>
              </WagmiConfig>
            </ReservoirKitProvider>
          </ToastProvider>
        </GlobalStateProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
