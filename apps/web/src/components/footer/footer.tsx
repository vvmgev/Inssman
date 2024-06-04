import Link from "next/link";
import Icon from "@repo/ui/icon";

const Footer = () => {
  return (
    <footer className="p-5 border-t border-slate-300/20">
      <div className="flex items-start justify-between text-sm">
        <div>
          <Icon className="w-[200px]" name="logo" />
          <span className="ml-2 text-slate-400">Boost your development efficiency.</span>
        </div>
        <div className="flex flex-col gap-4">
          <Link className="flex items-center gap-2" href="https://github.com/vvmgev/Inssman" target="_blank">
            <Icon name="github" />
            Source Code
          </Link>
          <Link target="__blank" href="mailto:inssman.modifier@gmail.com" className="flex items-center gap-2">
            <Icon name="envelope" />
            Contact
          </Link>
          <Link target="__blank" href="/docs" className="flex items-center gap-2">
            <Icon name="document" />
            Docs
          </Link>
        </div>
      </div>
      <div className="mt-10 text-slate-400">Copyright © 2023 Inssman, All rights reserved</div>
    </footer>
  );
};

export default Footer;
