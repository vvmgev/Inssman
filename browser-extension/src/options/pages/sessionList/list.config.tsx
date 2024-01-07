import Input from "@options/components/common/input/input";
import Tooltip from "@options/components/common/tooltip/tooltip";
import PlaySVG from "@assets/icons/play.svg";
import ShareSVG from "@assets/icons/share.svg";
import TrashSVG from "@assets/icons/trash.svg";
import ClipboardSVG from "@assets/icons/clipboard.svg";
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
      try {
        const { minutes, seconds } = timeDifference(
          item.events[0].timestamp,
          item.events[item.events.length - 1].timestamp
        );
        return `${minutes > 0 ? `${minutes}m` : ""} ${seconds}s `;
      } catch (error) {
        return "";
      }
    },
  },
  {
    field: "actions",
    classes: "flex justify-end",
    render: function (item, handlers) {
      return (
        <div className="flex gap-5">
          <Tooltip content="Play">
            <Link to={String(item.id)}>
              <div className="cursor-pointer hover:text-sky-500">
                <span className="w-[24px] inline-block">
                  <PlaySVG />
                </span>
              </div>
            </Link>
          </Tooltip>
          <Tooltip
            overlayInnerStyle={item?.docID ? { padding: 0 } : {}}
            content={
              item?.docID ? (
                <Input
                  readOnly
                  value={handlers.generateShareUrl(item.docID)}
                  suffix={
                    <span
                      onClick={() => handlers?.handleCopyToClipboard(item.docID)}
                      className="w-[24px] cursor-pointer hover:text-sky-500"
                    >
                      <Tooltip content="Copy">
                        <div className="cursor-pointer hover:text-sky-500">
                          <span onClick={() => handlers?.handleShare(item)} className="w-[24px] inline-block">
                            <ClipboardSVG />
                          </span>
                        </div>
                      </Tooltip>
                    </span>
                  }
                />
              ) : (
                "Share"
              )
            }
          >
            <div className={`cursor-pointer ${item?.docID ? "text-sky-500" : "hover:text-sky-500"}`}>
              <span onClick={() => handlers?.handleShare(item)} className="w-[24px] inline-block">
                <ShareSVG />
              </span>
            </div>
          </Tooltip>
          <Tooltip content="Delete Session">
            <div className="cursor-pointer hover:text-red-400" onClick={() => handlers?.handleDelete(item)}>
              <span className="w-[24px] inline-block">
                <TrashSVG />
              </span>
            </div>
          </Tooltip>
        </div>
      );
    },
  },
];
