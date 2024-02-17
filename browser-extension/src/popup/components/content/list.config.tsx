import { ListHeader, ListItems } from "@/options/components/common/list/list";
import Switcher from "@options/components/common/switcher/switcher";
import { IconsMap, PageName } from "@models/formFieldModel";

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

export const LIST_ITEMS: ListItems[] = [
  {
    field: "name",
    render: function (item, handlers) {
      return handlers?.cutString(item[this.field]);
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
      return "source";
      // return handlers?.cutString(item[this.field]);
    },
  },
  {
    field: "enabled",
    classes: "justify-end",
    render: function (item, handlers) {
      return <Switcher checked={item[this.field]} onChange={(event) => handlers?.handleToggleRule(event, item)} />;
    },
  },
];
