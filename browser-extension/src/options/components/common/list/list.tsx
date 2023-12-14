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

type Props = {
  headers: ListHeader[];
  items: ListItems[];
  listClasses?: string;
  data: any;
  texts?: {
    title: string;
    description: string;
  };
};

const List: FC<Props> = ({
  headers,
  items,
  data,
  listClasses = "",
  texts = {
    title: "Seems You Have Not Item",
    description: "",
  },
}) => {
  return (
    <>
      <div className="py-3 px-6 flex justify-between items-center w-full border-b border-slate-700 bg-slate-700 bg-opacity-40">
        {headers.map((item) => {
          return (
            <div key={item.title} className={`flex-1 ${item.classes || ""}`}>
              {item.render()}
            </div>
          );
        })}
      </div>
      {data.length ? (
        <ul
          className={twMerge(
            `w-full overflow-y-auto min-h-[350px] max-h-[450px]`,
            listClasses
          )}
        >
          {data.map((row) => (
            <li
              key={row.id}
              className="py-5 max-h-[90%] flex justify-between items-center px-6 border-b border-slate-700 w-full hover:bg-slate-800 hover:bg-opacity-40"
            >
              {items.map((item) => {
                return (
                  <div
                    key={item.field}
                    className={`flex flex-1 ${item.classes || ""}`}
                  >
                    {item.render(row)}
                  </div>
                );
              })}
            </li>
          ))}
        </ul>
      ) : (
        <div className="min-h-[350px] max-h-[450px] flex items-center justify-center">
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
