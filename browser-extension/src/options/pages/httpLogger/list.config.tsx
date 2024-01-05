import { ListHeader, ListItems } from "@/options/components/common/list/list";

export const LIST_HEADERS: ListHeader[] = [
  {
    title: "ID",
    render: function () {
      return this.title;
    },
  },
  {
    title: "Status Code",
    render: function () {
      return this.title;
    },
  },
  {
    title: "Method",
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
    title: "IP",
    render: function () {
      return this.title;
    },
  },
  {
    title: "From Cache",
    render: function () {
      return this.title;
    },
  },
  {
    title: "URL",
    classes: "flex justify-end",
    render: function () {
      return this.title;
    },
  },
];

export const LIST_ITEMS: ListItems[] = [
  {
    field: "requestId",
    render: function (item) {
      return item.id;
    },
  },
  {
    field: "statusCode",
    render: function (item) {
      return item[this.field] || "unknown";
    },
  },
  {
    field: "method",
    render: function (item) {
      return item[this.field] || "unknown";
    },
  },
  {
    field: "type",
    render: function (item) {
      return item[this.field] || "unknown";
    },
  },
  {
    field: "ip",
    render: function (item) {
      return item[this.field] || "unknown";
    },
  },
  {
    field: "fromCache",
    render: function (item) {
      return item[this.field] || "unknown";
    },
  },
  {
    field: "url",
    classes: "gap-5 justify-end",
    render: function (item) {
      return <div className="w-32 overflow-hidden text-ellipsis whitespace-nowrap">{item[this.field]}</div>;
    },
  },
];
