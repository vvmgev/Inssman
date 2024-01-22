import Button from "@options/components/common/button/button";
import Section from "@options/components/common/section/section";
import BackButton from "@options/components/common/backButton/backButton";
import Icon from "@options/components/common/icon/icon";
import { PageName, IconsMap } from "@models/formFieldModel";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  onSubmit: any;
  onDelete: any;
  error: Record<string, string | null>;
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
      <Section classes="flex justify-between px-2 py-4 border-0 border-b border-r bg-slate-800 bg-opacity-40">
        <BackButton trackName={pageType} url="/" text="Rules" />
        <span className="flex flex-col items-center">
          <span className="text-md">{mode === "create" ? "Create New Rule" : "Edit Rule"}</span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <span className="w-4">{IconsMap[pageType]}</span>
            {PageName[pageType]}
          </span>
        </span>
        <div className="flex gap-5">
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() =>
                chrome.tabs.create({
                  url: `https://github.com/vvmgev/Overrider#${pageType}`,
                })
              }
              trackName="View Example"
            >
              View Example
            </Button>
          </div>
          {mode === "update" && (
            <Button
              variant="outline"
              trackName="Delete rule edit mode"
              className="hover:border-red-400 hover:text-red-400"
              onClick={onDelete}
              startIcon={<Icon name="trash" />}
            >
              Delete
            </Button>
          )}
          <div>
            <Button
              startIcon={<Icon name="pencil" />}
              trackName={`${PageName[pageType]} Rule Create Event`}
              onClick={onSubmit}
            >
              {mode === "create" ? "Create" : "Edit"}
            </Button>
          </div>
        </div>
      </Section>
      <Section classes="px-2 py-4 border-0 border-b border-r bg-slate-800 bg-opacity-40">
        <div className="text-red-500 text-md">{error.general}</div>
        <form onSubmit={onSubmitHandler}>
          {children}
          <input type="submit" className="hidden" />
        </form>
      </Section>
    </>
  );
};

export default Form;
