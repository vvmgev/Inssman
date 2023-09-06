import React, { FC, ReactElement } from 'react';
import ListSVG  from 'assets/icons/list.svg';
import PlusSVG  from 'assets/icons/plus.svg';

export enum Tabs {
    CreatRule,
    RuleList
}

type Props = {
    onChangeTab: (Tabs) => void,
    active: Tabs
}

const Tab: FC<Props> = ({ active, onChangeTab }): ReactElement => {
    return (
        <ul className="flex text-sm font-medium text-center divide-x shadow divide-gray-700 cursor-pointer">
            <li className="w-full" onClick={() => onChangeTab(Tabs.RuleList)}>
                <div className={`flex items-center gap-3 w-full p-4 ${active === Tabs.RuleList ? 'bg-gray-700 text-sky-400' : 'text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-sky-400'}`}>
                    <span className="w-[24px]">{<ListSVG />}</span>
                    <span>Rule List</span>
                </div>
            </li>
            <li className="w-full flex" onClick={() => onChangeTab(Tabs.CreatRule)}>
                <div className={`flex items-center gap-3 w-full p-4 ${active === Tabs.CreatRule ? 'bg-gray-700 text-sky-400' : 'text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-sky-400'}`}>
                    <span className="w-[24px]">{<PlusSVG />}</span>
                    <span>Create Rule</span>
                </div>
            </li>
        </ul>
    )
};

export default Tab;