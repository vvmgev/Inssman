import Link from "next/link";
import Section from "../section/section";

const InstallExtension = () => {
  return (
    <Section classes="flex-1 flex flex-col gap-14 h-full rounded-none items-center justify-center">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-3xl">
            Please Install The Browser Extension{" "}
            <span className="px-1 tracking-widest rounded bg-sky-600">
              <Link href="https://chromewebstore.google.com/detail/inssman-modify-http-heade/ghlpdbkhlenlfiglgphledhfhchjfjfk">
                INSSMAN
              </Link>
            </span>
          </div>
          <div className="text-gray-400">
            To unlock the full potential of Inssman, harness all its provided features.
            <br />
            All features are free and there isn't any limitation to create a rule.
            <br />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href="https://chromewebstore.google.com/detail/inssman-modify-http-heade/ghlpdbkhlenlfiglgphledhfhchjfjfk"
            className="flex gap-1 hover:text-sky-600"
          >
            <span>Install Inssman For Google Chrome</span>
            <img
              width="20"
              alt="Chrome logo"
              src="https://github.com/vvmgev/Inssman/assets/11613729/338e9918-3a5a-45e6-96f5-6b0c1fdd94d7"
            />
          </Link>
          <Link
            href="https://microsoftedge.microsoft.com/addons/detail/inssman-modify-http-head/obibnmkbiilpbkhpkoagnkkjlghlndpf"
            className="flex gap-1 hover:text-sky-600"
          >
            <span>Install Inssman For Microsft Edge &nbsp;&nbsp;</span>
            <img
              width="20"
              alt="Microsoft Edge logo"
              src="https://github.com/vvmgev/Inssman/assets/11613729/c15a2d97-a43c-4924-b7f1-6ba7992b9ae3"
            />
          </Link>
        </div>
      </div>
    </Section>
  );
};

export default InstallExtension;
