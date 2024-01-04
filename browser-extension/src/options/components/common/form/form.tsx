import Button from "@options/components/common/button/button";
import BackButton from "@options/components/common/backButton/backButton";
import OutlineButton from "@options/components/common/outlineButton/outlineButton";
import TrashSVG from "@assets/icons/trash.svg";
import PencilSVG from "@assets/icons/pencil.svg";
import { PageName, IconsMap } from "@models/formFieldModel";
import { FormError } from "@options/HOC/formHOC";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  onSubmit: Function;
  onDelete: Function;
  error: FormError;
  pageType: string;
  mode: string;
}>;

const Form = ({ children, onSubmit, onDelete, error, pageType, mode = "create" }: Props) => {
  const onSubmitHandler = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <>
      <div className="flex justify-between mb-3">
        <BackButton trackName={pageType} url="/" text="Rules" />
        <span className="flex flex-col items-center">
          <span>{mode === "create" ? "Create New Rule" : "Edit Rule"}</span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <span className="w-4">{IconsMap[pageType]}</span>
            {PageName[pageType]}
          </span>
        </span>
        <div className="flex gap-5">
          <div className="flex justify-end">
            <OutlineButton
              onClick={() =>
                chrome.tabs.create({
                  url: `https://github.com/vvmgev/Overrider#${pageType}`,
                })
              }
              trackName="View Example"
            >
              View Example
            </OutlineButton>
          </div>
          {mode === "update" && (
            <OutlineButton
              trackName="Delete rule edit mode"
              classes="hover:border-red-400 hover:text-red-400"
              onClick={onDelete}
              icon={<TrashSVG />}
            >
              Delete
            </OutlineButton>
          )}
          <div>
            <Button icon={<PencilSVG />} trackName={`${PageName[pageType]} Rule Create Event`} onClick={onSubmit}>
              {mode === "create" ? "Create" : "Edit"}
            </Button>
          </div>
        </div>
      </div>
      {/* @ts-ignore */}
      <div className="text-red-500 text-md">{error.general}</div>
      <form onSubmit={onSubmitHandler}>
        {children}
        <input type="submit" className="hidden" />
      </form>
    </>
  );
};

export default Form;
