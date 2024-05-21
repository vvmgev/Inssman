import { ListHeader, ListItems } from "@/options/components/common/list/list";
import Switcher from "@options/components/common/switcher/switcher";
import { IconsMap, PageName } from "@models/formFieldModel";
import Button from "@options/components/common/button/button";
import TabService from "@services/TabService";

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
    classes: "flex justify-end flex-none",
    render: function () {
      return this.title;
    },
  },
];

const onEditClick = async (item, featureOpenWebApp) => {
  const url: string = featureOpenWebApp
    ? `https://www.inssman.com/app/edit/${item.pageType}/${item.id}`
    : chrome.runtime.getURL(`options/options.html#/edit/${item.pageType}/${item.id}`);
  TabService.createTab(url);
};

export const LIST_ITEMS: ListItems[] = [
  {
    field: "name",
    render: function (item, handlers) {
      return (
        <Button
          className="text-left"
          size="medium"
          variant="link"
          onClick={() => onEditClick(item, handlers.featureOpenWebApp)}
        >
          {handlers?.cutString(item[this.field], 15)}
        </Button>
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
      const firstSource = handlers?.cutString(item.conditions[0][this.field], 20);
      if (item.conditions.length > 1) {
        return `${firstSource} + ${item.conditions.length - 1}`;
      }
      return firstSource;
    },
  },
  {
    field: "enabled",
    classes: "justify-end flex-none",
    render: function (item, handlers) {
      return <Switcher checked={item[this.field]} onChange={(event) => handlers?.handleToggleRule(event, item)} />;
    },
  },
];
