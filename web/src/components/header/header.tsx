import Image from "next/image";
import Logo from "../../../../browser-extension/src/assets/images/icons/inssman_big.png";
import Link from "next/link";
import { FC } from "react";

type Props = {
  navbar?: boolean;
};

const Header: FC<Props> = ({ navbar }) => {
  return (
    <header className="z-[50] fixed top-0 w-full border-b backdrop-blur-sm bg-white/[0.6] dark:bg-black/[0.6] border-neutral-200 dark:border-white/[0.1]">
      <div className="flex items-center h-16 mx-5">
        <div className={`mr-2 cursor-pointer ${navbar ? "border-r border-slate-300/20" : ""}`}>
          <Image alt="Inssman" src={Logo} className="w-[200px]" />
        </div>
        {navbar && (
          <nav className="flex items-center space-x-6 text-sm font-medium xl:flex">
            <Link
              className="hidden transition-colors hover:text-foreground/80 text-foreground/60 sm:block"
              href="/docs"
            >
              Documentation
            </Link>
          </nav>
        )}
        <div className="flex items-center justify-end flex-1 gap-2 sm:gap-2 md:justify-end">
          <Link
            className="relative flex items-center h-10 p-px px-3 py-2 space-x-2 text-sm no-underline transition duration-200 cursor-pointer text-slate-100 bg-sky-600 hover:bg-sky-400 w-36 font-semiboldtext-center ustify-center group hover:shadow-2xl shadow-zinc-900 rounded-2xl"
            href="/app"
            target="_blank"
          >
            Open Application
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
