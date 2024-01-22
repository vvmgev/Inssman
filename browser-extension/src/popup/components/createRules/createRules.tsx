import Section from "@options/components/common/section/section";
import { FC, Fragment, ReactElement } from "react";
import { paths } from "@options/components/app/paths";
import { capitalizeFirstLetter } from "@utils/capitalizeFirstLetter";

const CreateRules: FC = (): ReactElement => {
  const onClick = (path) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
      const { hostname } = new URL(tab[0].url as string);
      const hostnameArr = hostname.split(".");
      const name = hostnameArr[hostnameArr.length - 2];
      const url: string = `options/options.html#/create/${path}?source=${hostname}&name=${capitalizeFirstLetter(name)}`;
      chrome.tabs.create({ url: chrome.runtime.getURL(url) });
    });
  };

  return (
    <Section classes="p-5">
      <div className="flex flex-row flex-wrap">
        {paths.map(({ icon, text, path }, index) => (
          <Fragment key={index}>
            {index % 3 === 0 ? <div className="w-full"></div> : null}
            <Section classes="w-[30%] p-4 m-[1%] hover:bg-opacity-70 cursor-pointer rounded-xl bg-slate-800 bg-opacity-40">
              <div onClick={() => onClick(path)}>
                <div className="flex flex-col items-center gap-3 align-center hover:text-sky-500">
                  <div className="w-[24px]">{icon}</div>
                  <div>{text}</div>
                </div>
              </div>
            </Section>
          </Fragment>
        ))}
      </div>
    </Section>
  );
};

export default CreateRules;
