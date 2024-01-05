import { FC } from "react";
import { twMerge } from "tailwind-merge";

export type ListHeader = {
  title: string;
  render: () => any;
  classes?: string;
};

export type ListItems = {
  field: string;
  render: (value: any, item?: any) => any;
  classes?: string;
};

type Item<T> = T;

type Props = {
  headers: ListHeader[];
  items: ListItems[];
  listClasses?: string;
  rowClasses?: string;
  headerClasses?: string;
  activeRow?: Item<any> | null;
  data: Item<any>[];
  // handlers?: Record<string, <T>(data: T) => void>;
  handlers?: any;
  onRowClick?: <T>(data: T) => void;
  texts?: {
    title?: string;
    description?: string;
  };
};

const List: FC<Props> = ({
  onRowClick = () => {},
  headers,
  items,
  data,
  handlers,
  listClasses = "",
  rowClasses = "",
  headerClasses = "",
  activeRow,
  texts = {
    title: "Seems You Have No Item",
    description: "",
  },
}) => {
  return (
    <>
      <div className="flex items-center justify-between w-full px-6 py-3 border-b border-slate-700 bg-slate-700 bg-opacity-40">
        {headers.map((item) => {
          return (
            <div key={item.title} className={twMerge(`flex-1 ${item.classes || ""}`, headerClasses)}>
              {item.render()}
            </div>
          );
        })}
      </div>
      {data.length ? (
        <ul className={twMerge(`w-full overflow-y-auto min-h-[350px] max-h-[450px]`, listClasses)}>
          {data.map((row) => (
            <li
              onClick={() => onRowClick(row)}
              key={row.id}
              className={twMerge(
                "py-5 max-h-[90%] flex justify-between items-center px-6 border-b border-slate-700 w-full hover:bg-slate-800 hover:bg-opacity-40",
                rowClasses,
                activeRow?.id === row.id ? "text-sky-500" : ""
              )}
            >
              {items.map((item) => {
                return (
                  <div key={item.field} className={`flex flex-1 ${item.classes || ""}`}>
                    {item.render(row, handlers)}
                  </div>
                );
              })}
            </li>
          ))}
        </ul>
      ) : (
        <div className="min-h-[350px] max-h-[450px] flex items-center justify-center w-full">
          <div className="w-full text-center">
            <p className="text-2xl">{texts.title}</p>
            <p className="mt-3">{texts.description}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default List;
