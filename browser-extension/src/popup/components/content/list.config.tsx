import { ListHeader, ListItems } from "@/options/components/common/list/list";
import Switcher from "@options/components/common/switcher/switcher";
import { IconsMap, PageName } from "@models/formFieldModel";
import TabService from "@services/TabService";
import Tooltip from "@options/components/common/tooltip/tooltip";

export const LIST_HEADERS: ListHeader[] = [
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

const onEditClick = async (item) => {
  const url: string = chrome.runtime.getURL(`options/options.html#/edit/${item.pageType}/${item.id}`);
  await TabService.createTab(url);
};

export const LIST_ITEMS: ListItems[] = [
  {
    field: "name",
    render: function (item) {
      return (
        <span
          className="cursor-pointer hover:underline hover:underline-offset-2 hover:text-sky-500 text-left w-full truncate mr-1"
          onClick={() => onEditClick(item)}
        >
          {item[this.field]}
        </span>
      );
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
    render: function (item, handlers) {
      const firstSource = item.conditions[0][this.field];
      const extraConditionsCount = item.conditions.length - 1;
      const content = extraConditionsCount ? `${firstSource} + ${extraConditionsCount}` : firstSource;

      return (
        <Tooltip content={content}>
          <span className="truncate">{content}</span>
        </Tooltip>
      );
    },
  },
  {
    field: "enabled",
    classes: "flex justify-end",
    render: function (item, handlers) {
      return <Switcher checked={item[this.field]} onChange={(event) => handlers?.handleToggleRule(event, item)} />;
    },
  },
];
