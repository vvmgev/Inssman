import ColorCover from "@options/components/common/colorCover/colorCover";
import Switcher from "@options/components/common/switcher/switcher";
import CreateRules from "../createRules/createRules";
import List, { ListHeader, ListItems } from "@options/components/common/list/list";
import Tab, { Tabs } from "@popup/components/tab/tab";
import { PostMessageAction } from "@models/postMessageActionModel";
import { IRuleMetaData, IconsMap, PageName } from "@models/formFieldModel";
import { cutString } from "@utils/cutString";
import { useEffect, useMemo, useState } from "react";

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

  const LIST_HEADERS: ListHeader[] = useMemo(() => {
    return [
      {
        title: "Name",
        render: function () {
          return this.title;
        },
      },
      {
        title: "Type",
        render: function () {
          return this.title;
        },
      },
      {
        title: "Source",
        render: function () {
          return this.title;
        },
      },
      {
        title: "Status",
        classes: "flex justify-end",
        render: function () {
          return this.title;
        },
      },
    ];
  }, []);

  const LIST_ITEMS: ListItems[] = useMemo(() => {
    return [
      {
        field: "name",
        render: function (item) {
          return cutString(item[this.field]);
        },
      },
      {
        field: "pageType",
        render: function (item) {
          return (
            <>
              <span className="w-[18px]">{IconsMap[item[this.field]]}</span>
              <div>{PageName[item[this.field]]}</div>
            </>
          );
        },
      },
      {
        field: "source",
        render: function (item) {
          return cutString(item[this.field]);
        },
      },
      {
        field: "enabled",
        classes: "justify-end",
        render: function (item) {
          return <Switcher checked={item[this.field]} onChange={(event) => onChangeRuleStatus(event, item.id)} />;
        },
      },
    ];
  }, []);

  return (
    <ColorCover classes="border-l-0 border-r-0 rounded-none p-0">
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
            data={rules}
            texts={{
              title: "Seems You Have Not Created a Rule Yet",
              description: 'Please Select One Of Rule In The "Create Rule" Tab',
            }}
          />
        </div>
      )}
    </ColorCover>
  );
};

export default Content;
