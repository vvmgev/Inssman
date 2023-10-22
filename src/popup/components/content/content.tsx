import { useEffect, useState } from 'react';
import ColorCover from 'options/components/common/colorCover/colorCover';
import CreateRules from '../createRules/createRules';
import RuleList from 'components/ruleList/ruleList';
import Tab, { Tabs } from 'src/popup/components/tab/tab';
import { PostMessageAction } from 'src/models/postMessageActionModel';


const Content = () => {
    const [tab, setTab] = useState<Tabs>(Tabs.RuleList);
    const onChangeTab = (tab: Tabs) => setTab(tab);
    useEffect(() => {
        chrome.runtime.sendMessage({action: PostMessageAction.GetStorageRules}, (rules) => {
            setTab(rules.length ? Tabs.RuleList : Tabs.CreatRule);
        });
    }, []);

    return (
        <ColorCover classes="border-l-0 border-r-0 rounded-none p-0">
            <div className='p-4 h-full'><Tab active={tab} onChangeTab={onChangeTab} /></div>
            {tab === Tabs.CreatRule ?
                <CreateRules /> :
                <div className='overflow-hidden h-full'>
                    <RuleList fullColumns={false} listClasses='max-h-[250px]' page='popup' />
                </div>

            }
        </ColorCover>
    )
}

export default Content;
