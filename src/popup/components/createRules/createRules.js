import { Fragment } from 'react';
import ColorCover from 'src/options/components/common/colorCover/colorCover';
import { paths } from 'src/options/components/app/paths';
import { capitalizeFirstLetter } from 'src/utils/capitalizeFirstLetter';

function CreateRules() {
  const onClick = (path) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
      const { hostname } = new URL(tab[0].url);
      const hostnameArr = hostname.split('.');
      const name = hostnameArr[hostnameArr.length - 2];
      const url = `options/options.html#/create/${path}?source=${hostname}&name=${capitalizeFirstLetter(name)}`;
      chrome.tabs.create({ url: chrome.runtime.getURL(url) });
    });
  };

  return (
    <ColorCover classes="p-5 rounded-none">
      <div className="flex flex-row flex-wrap">
        {paths.map(({ icon, text, path }, index) => (
          <Fragment key={index}>
            {index % 3 === 0 ? <div className="w-full" /> : null}
            <ColorCover classes="w-[30%] p-4 m-[1%] hover:bg-opacity-70 cursor-pointer">
              <div onClick={() => onClick(path)}>
                <div className="flex flex-col items-center align-center gap-3 hover:text-sky-500">
                  <div className="w-[24px]">{icon}</div>
                  <div>{text}</div>
                </div>
              </div>
            </ColorCover>
          </Fragment>
        ))}
      </div>
    </ColorCover>
  );
}

export default CreateRules;
