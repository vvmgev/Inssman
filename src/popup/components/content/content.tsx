import React, { Fragment } from 'react';
import { paths } from 'src/options/components/app/paths';
import ColorCover from 'src/options/components/common/colorCover/colorCover';
import OutlineButton from 'src/options/components/common/outlineButton/outlineButton';
import { capitalizeFirstLetter } from 'src/options/utils/capitalizeFirstLetter';

const Content = () => {
    let tabUrl = '';
    chrome.tabs.query({ active: true, currentWindow: true }, tab => tabUrl = tab[0].url as string);
    const onClick = path => {
        const { hostname } = new URL(tabUrl);
        const hostnameArr = hostname.split('.')
        const name = hostnameArr[hostnameArr.length - 2];
        const url: string = `options/options.html#/create/${path}?source=${hostname}&name=${capitalizeFirstLetter(name)}`; 
        chrome.tabs.create({url: chrome.runtime.getURL(url)});
    };
    const onHandleOpen = () => chrome.runtime.openOptionsPage();

    return <ColorCover classes="p-5">
        <div className="flex items-center flex-row justify-between align-center mb-[15px]">
            <div className="text-xl">Create Rule</div>
            <OutlineButton onClick={onHandleOpen} trackName='View All Rules'>View All Rules</OutlineButton>
        </div>
        <div className="flex flex-row flex-wrap">
            {paths.map(({icon, text, path}, index) => (
                <Fragment key={index}>
                    {index % 3 === 0 ? <div className="w-full"></div> : null}
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
}

export default Content;