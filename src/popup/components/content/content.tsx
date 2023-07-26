import React, { Fragment } from 'react';
import { paths } from 'src/options/components/app/paths';
import ColorCover from 'src/options/components/common/colorCover/colorCover';
import OutlineButton from 'src/options/components/common/outlineButton/outlineButton';

const Content = () => {
    let tabUrl = '';
    chrome.tabs.query({ active: true, currentWindow: true }, tab => tabUrl = tab[0].url as string);
    const onClick = path => {
        const { hostname } = new URL(tabUrl);
        chrome.tabs.create({url: chrome.runtime.getURL(`options/options.html#/create/${path}?source=${hostname}`)})
    };

    return <ColorCover classes="p-5">
        <div className="flex items-center flex-row justify-between align-center mb-[15px]">
            <div className="text-xl">Create Rule</div>
            <a href={chrome.runtime.getURL('options/options.html')} target="_blank">
                <OutlineButton>View All Rules</OutlineButton>
            </a>
        </div>
        <div className="flex flex-row flex-wrap">
            {paths.map(({icon, text, path}, index) => (
                <Fragment key={index}>
                    {index % 3 === 0 ? <div className="w-full"></div> : null}
                    <ColorCover classes="w-[30%] p-4 m-[1%] hover:bg-opacity-70">
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