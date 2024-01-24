import Button from "@/options/components/common/button/button";
import Input from "@options/components/common/input/input";
import Dialog from "@/options/components/dialog/dialog";
import Tooltip from "@options/components/common/tooltip/tooltip";
import Icon from "@options/components/common/icon/icon";
import { ListHeader, ListItems } from "@options/components/common/list/list";
import { Link } from "react-router-dom";
import { timeDifference } from "@utils/timeDifference";
import { cutString } from "@utils/cutString";

export const LIST_HEADERS: ListHeader[] = [
  {
    title: "Name",
    render: function () {
      return this.title;
    },
  },
  {
    title: "URL",
    render: function () {
      return this.title;
    },
  },
  {
    title: "Date",
    render: function () {
      return this.title;
    },
  },
  {
    title: "Duration",
    classes: "flex justify-end",
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

export const LIST_ITEMS: ListItems[] = [
  {
    field: "name",
    render: function (item) {
      return (
        <div className="flex gap-2">
          <img
            src={`https://www.google.com/s2/favicons?domain=${item.url}`}
            onLoad={(event: any) => event.target.classList?.toggle("invisible")}
            alt=""
            className="invisible w-5 h-5"
          />
          <span className="capitalize">{item[this.field]}</span>
        </div>
      );
    },
  },
  {
    field: "url",
    render: function (item) {
      return cutString(item[this.field]);
    },
  },
  {
    field: "date",
    render: function (item) {
      return item[this.field];
    },
  },
  {
    field: "duration",
    classes: "flex justify-end",
    render: function (item) {
      const { minutes, seconds } = item.duration;
      return `${minutes > 0 ? `${minutes}m` : ""} ${seconds}s `;
    },
  },
  {
    field: "actions",
    classes: "flex justify-end",
    render: function (item, options) {
      const self = item;
      return (
        <div className="flex gap-5">
          <Dialog
            title="Confirm Deletion"
            visible={options.dialogName === "deleteSession"}
            onClose={() => {
              options.selectSession(null);
              options.setDialogName("");
            }}
            footer={
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  trackName="Delete Session - NO"
                  className="min-w-[100px]"
                  onClick={() => {
                    options.selectSession(null);
                    options.setDialogName("");
                  }}
                >
                  No
                </Button>
                <Button
                  variant="outline"
                  startIcon={<Icon name="trash" />}
                  className="min-w-[100px] hover:text-red-400 hover:border-red-400"
                  trackName="Delete Session - YES"
                  onClick={() => {
                    options.setDialogName("");
                    options.selectSession(null);
                    options.handleDelete(item);
                  }}
                >
                  Yes
                </Button>
              </div>
            }
          >
            <div className="my-10 text-2xl text-center text-slate-200 back">
              Are You Sure Want To Delete Recorded Sessions?
            </div>
          </Dialog>
          <Tooltip content="Play">
            <Link to={String(item.id)}>
              <div className="cursor-pointer hover:text-sky-500">
                <Icon name="play" />
              </div>
            </Link>
          </Tooltip>
          <Tooltip
            overlayInnerStyle={item?.docID ? { padding: 0 } : {}}
            content={
              item?.docID ? (
                <Input
                  readOnly
                  value={options.generateShareUrl(item.docID)}
                  endIcon={
                    <Tooltip content="Copy">
                      <div onClick={() => options?.handleCopyToClipboard(item.docID)}>
                        <Icon name="clipboard" />
                      </div>
                    </Tooltip>
                  }
                />
              ) : (
                "Share"
              )
            }
          >
            <div className={`cursor-pointer ${item?.docID ? "text-sky-500" : "hover:text-sky-500"}`}>
              <span onClick={() => options?.handleShare(self)}>
                <Icon name={item.id === options.sharingItemId ? "loader" : "share"} />
              </span>
            </div>
          </Tooltip>
          <Tooltip content="Delete Session">
            <Button
              variant="icon"
              trackName="delete session"
              className="hover:text-red-400"
              onClick={() => {
                options.setDialogName("deleteSession");
                options.selectSession(item);
              }}
            >
              <Icon name="trash" />
            </Button>
          </Tooltip>
        </div>
      );
    },
  },
];
