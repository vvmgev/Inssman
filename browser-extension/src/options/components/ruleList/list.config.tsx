import Switcher from "@options/components/common/switcher/switcher";
import Tooltip from "@options/components/common/tooltip/tooltip";
import Icon from "@options/components/common/icon/icon";
import { ListHeader, ListItems } from "@options/components/common/list/list";
import { IconsMap, PageName } from "@/models/formFieldModel";
import { Link } from "react-router-dom";

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
    classes: "flex justify-end pr-4",
    render: function () {
      return this.title;
    },
  },
];

export const LIST_ITEMS: ListItems[] = [
  {
    field: "name",
    render: function (item) {
      return <span className="truncate">{item[this.field]}</span>;
    },
  },
  {
    field: "pageType",
    render: function (item) {
      return (
        <div className="flex gap-1">
          <span className="w-[18px]">{IconsMap[item[this.field]]}</span>
          <div>{PageName[item[this.field]]}</div>
        </div>
      );
    },
  },
  {
    field: "source",
    classes: "pr-2",
    render: function (item) {
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
    field: "lastMatchedTimestamp",
    render: function (item, handlers) {
      return handlers?.generateLastMatchedTime(item[this.field]);
    },
  },
  {
    field: "enabled",
    render: function (item, handlers) {
      return <Switcher checked={item[this.field]} onChange={(event) => handlers?.handleToggleRule(event, item)} />;
    },
  },
  {
    field: "actions",
    classes: "gap-2 justify-end",
    render: function (item, handlers) {
      return (
        <>
          <Tooltip content="Duplicate Rule">
            <div className="cursor-pointer hover:text-sky-500" onClick={() => handlers?.duplicateRule(item)}>
              <Icon name="documentCopy" />
            </div>
          </Tooltip>
          <Tooltip content="Edit Rule">
            <Link className="cursor-pointer hover:text-sky-500" to={`/edit/${item.pageType}/${item.id}`}>
              <Icon name="pencil" />
            </Link>
          </Tooltip>
          <Tooltip content="Delete Rule">
            <div className="cursor-pointer hover:text-red-400" onClick={() => handlers?.handleDelete(item)}>
              <Icon name="trash" />
            </div>
          </Tooltip>
          {/* add two empty tooltip
            to have more spac for last tooltip
            should be fixed by lib
          */}
          <Tooltip content="">
            <div></div>
          </Tooltip>
          <Tooltip content="">
            <div></div>
          </Tooltip>
        </>
      );
    },
  },
];
