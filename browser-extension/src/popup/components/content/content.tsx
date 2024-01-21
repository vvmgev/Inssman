import Section from "@options/components/common/section/section";
import CreateRules from "../createRules/createRules";
import List from "@options/components/common/list/list";
import Tab, { Tabs } from "@popup/components/tab/tab";
import { PostMessageAction } from "@models/postMessageActionModel";
import { IRuleMetaData } from "@models/formFieldModel";
import { cutString } from "@utils/cutString";
import { useEffect, useState } from "react";
import { LIST_HEADERS, LIST_ITEMS } from "./list.config";

const Content = () => {
  const [tab, setTab] = useState<Tabs>(Tabs.RuleList);
  const [rules, setRules] = useState<IRuleMetaData[]>([]);
  const getRules = (): void => chrome.runtime.sendMessage({ action: PostMessageAction.GetStorageRules }, setRules);
  const onChangeRuleStatus = (event, id): void =>
    chrome.runtime.sendMessage(
      {
        action: PostMessageAction.ChangeRuleStatusById,
        data: { id, checked: event.target.checked },
      },
      () => getRules()
    );
  const onChangeTab = (tab: Tabs) => setTab(tab);
  useEffect(() => {
    chrome.runtime.sendMessage({ action: PostMessageAction.GetStorageRules }, (rules) => {
      setTab(rules.length ? Tabs.RuleList : Tabs.CreatRule);
    });
  }, []);

  useEffect(() => getRules(), []);

  return (
    <Section classes="border-l-0 border-r-0 p-0 max-h-[430px]">
      <div className="h-full p-4">
        <Tab active={tab} onChangeTab={onChangeTab} />
      </div>
      {tab === Tabs.CreatRule ? (
        <CreateRules />
      ) : (
        <div className="overflow-hidden">
          <List
            listClasses="min-h-[initial] max-h-[initial] h-[300px]"
            headers={LIST_HEADERS}
            items={LIST_ITEMS}
            options={{
              cutString,
              onChangeRuleStatus,
            }}
            data={rules}
            texts={{
              title: "Seems You Have Not Created a Rule Yet",
              description: 'Please Select One Of Rule In The "Create Rule" Tab',
            }}
          />
        </div>
      )}
    </Section>
  );
};

export default Content;
