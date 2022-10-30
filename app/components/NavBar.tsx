import ConnectWallet from "./ConnectWallet";
import { ClientOnly } from "remix-utils";
import { Link } from "@remix-run/react";

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-[1000] col-span-full mb-[10px] flex items-center justify-center bg-primary-blue py-4 shadow-md shadow-slate-900 md:py-6">
      <div className="relative flex grow items-center justify-between px-6 sm:max-w-screen-2xl sm:px-32 ">
        <Link
          to="/"
          className="bg-gradient-to-r from-neon-pink to-light-purple bg-clip-text text-3xl text-transparent"
        >
          NFTracker<span>⚡</span>
        </Link>
        <ClientOnly>{() => <ConnectWallet />}</ClientOnly>
      </div>
    </nav>
  );
}
