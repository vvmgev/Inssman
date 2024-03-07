import Image from "next/image";
import GithubSVG from "../../app/github.svg";
import Logo from "../../../../browser-extension/src/assets/images/icons/inssman_big.png";

const Header = () => {
  return (
    <header className="z-[50] fixed top-0 w-full border-b backdrop-blur-sm bg-white/[0.6] dark:bg-black/[0.6] border-neutral-200 dark:border-white/[0.1]">
      <div className="flex items-center h-16 mx-5">
        <div className="cursor-pointer">
          <Image alt="Inssman" src={Logo} className="w-[200px]" />
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium xl:flex">
          {/* <a
        className="hidden transition-colors hover:text-foreground/80 text-foreground/60 sm:block"
        href="/components"
      >
        Components
      </a> */}
        </nav>
        <div className="flex items-center justify-end flex-1 gap-2 sm:gap-2 md:justify-end">
          <a
            target="__blank"
            className="mr-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
            href="https://github.com/vvmgev/Inssman"
          >
            <span className="flex items-center gap-2">
              <Image alt="Inssman Github" src={GithubSVG} />
              Github
            </span>
          </a>
          <a
            className="relative flex items-center h-10 p-px px-4 py-2 space-x-2 text-sm no-underline transition duration-200 cursor-pointer text-slate-100 bg-sky-600 hover:bg-sky-400 w-36 font-semiboldtext-center ustify-center group hover:shadow-2xl shadow-zinc-900 rounded-2xl"
            href="https://chromewebstore.google.com/detail/inssman-open-source-modif/ghlpdbkhlenlfiglgphledhfhchjfjfk?hl=en&authuser=0"
            target="_blank"
          >
            Add to Browser
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
