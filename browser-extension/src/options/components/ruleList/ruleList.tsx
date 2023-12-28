import TrackService from "@services/TrackService";
import Switcher from "@options/components/common/switcher/switcher";
import Tooltip from "@options/components/common/tooltip/tooltip";
import PencilSVG from "@assets/icons/pencil.svg";
import TrashSVG from "@assets/icons/trash.svg";
import DocumentCopySVG from "@assets/icons/documentCopy.svg";
import List, { ListHeader, ListItems } from "@options/components/common/list/list";
import { FC, ReactElement, useMemo } from "react";
import { PostMessageAction } from "@models/postMessageActionModel";
import { Link } from "react-router-dom";
import { IRuleMetaData, IconsMap, PageName } from "@models/formFieldModel";
import { generateLastMatchedTime } from "@utils/generateLastMatchedTime";
import { cutString } from "@utils/cutString";

type Props = {
  rules: IRuleMetaData[];
  getRules: () => void;
  search?: string;
  listClasses?: string;
  columns?: [];
  page?: string;
};

const RuleList: FC<Props> = ({ rules, getRules, search = "", listClasses = "", page = "options" }): ReactElement => {
  const duplicateRule = (id: number): void =>
    chrome.runtime.sendMessage({ action: PostMessageAction.CopyRuleById, data: { id } }, () => getRules());
  const onChangeRuleStatus = (event, id): void =>
    chrome.runtime.sendMessage(
      {
        action: PostMessageAction.ChangeRuleStatusById,
        data: { id, checked: event.target.checked },
      },
      () => getRules()
    );
  const handleDelete = (ruleMetaData) => {
    TrackService.trackEvent(`${PageName[ruleMetaData.pageType]} Rule Delete Event`);
    chrome.runtime.sendMessage(
      {
        action: PostMessageAction.DeleteRule,
        data: { id: ruleMetaData.id },
      },
      () => getRules()
    );
  };

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
        title: "Last Matched",
        render: function () {
          return (
            <span>
              {this.title}
              <sup className="inline-block text-xs text-red-500 bottom-4">Beta</sup>
            </span>
          );
        },
      },
      {
        title: "Status",
        render: function () {
          return this.title;
        },
      },
      {
        title: "Actions",
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
          ``;
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
        field: "lastMatchedTimestamp",
        render: function (item) {
          return generateLastMatchedTime(item[this.field]);
        },
      },
      {
        field: "enabled",
        render: function (item) {
          return <Switcher checked={item[this.field]} onChange={(event) => onChangeRuleStatus(event, item.id)} />;
        },
      },
      {
        field: "actions",
        classes: "gap-5 justify-end",
        render: function (item) {
          return (
            <>
              <Tooltip content="Duplicate Rule">
                <div className="cursor-pointer hover:text-sky-500" onClick={() => duplicateRule(item.id)}>
                  <span className="w-[24px] inline-block">
                    <DocumentCopySVG />
                  </span>
                </div>
              </Tooltip>
              <Tooltip content="Edit Rule">
                <Link className="cursor-pointer hover:text-sky-500" to={`/edit/${item.pageType}/${item.id}`}>
                  <span className="w-[24px] inline-block">
                    <PencilSVG />
                  </span>
                </Link>
              </Tooltip>
              <Tooltip content="Delete Rule">
                <div className="cursor-pointer hover:text-red-400" onClick={() => handleDelete(item)}>
                  <span className="w-[24px] inline-block">
                    <TrashSVG />
                  </span>
                </div>
              </Tooltip>
            </>
          );
        },
      },
    ];
  }, []);

  return (
    <List
      headers={LIST_HEADERS}
      items={LIST_ITEMS}
      data={rules.filter((ruleMetaData) => ruleMetaData.name.includes(search)).reverse()}
      listClasses={listClasses}
      texts={{
        title: "Seems You Have Not Created a Rule Yet",
        description:
          page === "options"
            ? "Please Select One Of Rule In The Sidebar To Create Or Choose a Templates"
            : 'Please Select One Of Rule In The "Create Rule" Tab To Create',
      }}
    />
  );
};

export default RuleList;
