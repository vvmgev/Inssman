import Image from "next/image";
import GithubSVG from "../../app/github.svg";
import EnvelopeSVG from "../../app/envelope.svg";
import DocumentSVG from "../../app/document.svg";
import Logo from "../../../../browser-extension/src/assets/images/icons/inssman_big.png";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="p-5 border-t border-slate-300/20">
      <div className="flex items-start justify-between text-sm">
        <div>
          <Image alt="Inssman" src={Logo} className="w-[200px]" />
          <span className="ml-2 text-slate-400">Boost your development efficiency.</span>
        </div>
        <div className="flex flex-col gap-4">
          <Link className="flex items-center gap-2" href="https://github.com/vvmgev/Inssman" target="_blank">
            <Image alt="Inssman Github" src={GithubSVG} />
            Source Code
          </Link>
          <Link target="__blank" href="mailto:inssman.modifier@gmail.com" className="flex items-center gap-2">
            <Image alt="email" src={EnvelopeSVG} />
            Contact
          </Link>
          <Link target="__blank" href="/documentation" className="flex items-center gap-2">
            <Image alt="ducumentation" src={DocumentSVG} />
            Documentation
          </Link>
        </div>
      </div>
      <div className="mt-10 text-slate-400">Copyright © 2023 Inssman, All rights reserved</div>
    </footer>
  );
};

export default Footer;
