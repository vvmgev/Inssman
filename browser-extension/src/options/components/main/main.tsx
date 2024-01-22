import Input from "@options/components/common/input/input";
import Button from "@options/components/common/button/button";
import Dialog from "@options/components/dialog/dialog";
import Section from "@options/components/common/section/section";
import RuleList from "../ruleList/ruleList";
import Icon from "@options/components/common/icon/icon";
import { useState, useRef, useEffect } from "react";
import { PostMessageAction } from "@models/postMessageActionModel";
import { IRuleMetaData } from "@models/formFieldModel";
import { downloadFile } from "@utils/downloadFile";
import { validateJSON } from "@utils/validateJSON";
import { readFile } from "@utils/readFile";

export default () => {
  const importRulesRef = useRef<any>();
  const [search, setSearch] = useState<string>("");
  const [rules, setRules] = useState<IRuleMetaData[]>([]);
  const [dialogName, setDialogName] = useState<string>("");
  const onHandleClearSearch = () => setSearch("");
  const onChangeSearch = (event) => setSearch(event.target.value);
  const onHandleImport = () => importRulesRef.current.click();
  const getRules = (): void => chrome.runtime.sendMessage({ action: PostMessageAction.GetStorageRules }, setRules);
  const onHandleExportRules = (): void =>
    chrome.runtime.sendMessage({ action: PostMessageAction.ExportRules }, (rules) => downloadFile(rules));
  const onHandleDeleteRules = (): void =>
    chrome.runtime.sendMessage({ action: PostMessageAction.DeleteRules }, () => {
      setDialogName("");
      getRules();
    });

  const onHandleUploadFile = (event) => {
    readFile(event.target.files[0], (fileContent) => {
      if (validateJSON(fileContent)) {
        const data = JSON.parse(fileContent);
        chrome.runtime.sendMessage({
          action: PostMessageAction.ImportRules,
          data,
        });
      } else {
        setDialogName("importFailed");
      }
    });
  };

  useEffect(() => getRules(), []);

  return (
    <>
      <Dialog
        title="Import Failed"
        visible={dialogName === "importFailed"}
        onClose={() => setDialogName("")}
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              trackName="Import faild - close"
              className="min-w-[100px]"
              onClick={() => setDialogName("")}
            >
              Close
            </Button>
          </div>
        }
      >
        <div className="mt-10 text-2xl text-center text-slate-200">You have Invalid JSON file</div>
        <div className="text-base text-center text-slate-500">Please make sure you are uploading valid JSON file</div>
        <div className="mb-10 text-base text-center text-slate-500">
          You can validate by this service &nbsp;
          <a
            className="underline cursor-pointer text-sky-500"
            href="https://codebeautify.org/jsonvalidator"
            target="_black"
          >
            Codebeautify.org
          </a>
        </div>
      </Dialog>
      <Dialog
        title="Confirm Deletion"
        visible={dialogName === "deleteAllRules"}
        onClose={() => setDialogName("")}
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              trackName="Delete All Rules - NO"
              className="min-w-[100px]"
              onClick={() => setDialogName("")}
            >
              No
            </Button>
            <Button
              variant="outline"
              startIcon={<Icon name="trash" />}
              className="min-w-[100px] hover:text-red-400 hover:border-red-400"
              trackName="Delete All Rules - YES"
              onClick={() => onHandleDeleteRules()}
            >
              Yes
            </Button>
          </div>
        }
      >
        <div className="my-10 text-2xl text-center text-slate-200">Are you sure want to delete all rules?</div>
      </Dialog>
      <Section classes="w-full h-full border-0 bg-slate-800 bg-opacity-40 border-slate-700 p-0 flex flex-col">
        <Section classes="border-t-0 border-l-0 py-5">
          <div className="max-h-[90%] w-full flex justify-between items-center">
            <span className="flex flex-row items-center gap-2 text-lg">
              <Icon name="list" />
              <span>All Rules</span>
            </span>
            <div className="flex items-center gap-2 text-sm">
              <div>
                <input
                  type="file"
                  onChange={onHandleUploadFile}
                  ref={importRulesRef}
                  className="hidden"
                  accept="application/JSON"
                />
                <Button
                  variant="outline"
                  onClick={onHandleImport}
                  trackName="Import rules"
                  startIcon={<Icon name="arrowDownLong" />}
                >
                  Import
                </Button>
              </div>
              <div>
                <Button
                  variant="outline"
                  onClick={onHandleExportRules}
                  trackName="Export rules"
                  startIcon={<Icon name="arrowUpLong" />}
                >
                  Export
                </Button>
              </div>
              <Button
                onClick={() => setDialogName("deleteAllRules")}
                variant="outline"
                className="hover:text-red-400 hover:border-red-400"
                trackName="Delete All Rules Popup"
                startIcon={<Icon name="trash" />}
              >
                Delete All Rules
              </Button>
              <Button
                size="small"
                onClick={() => setDialogName("deleteAllRules")}
                variant="outline"
                className="hover:text-red-400 hover:border-red-400"
                trackName="Delete All Rules Popup"
                startIcon={<Icon name="trash" />}
              >
                Delete All Rules
              </Button>
              <div className="text-sm">
                <Input
                  placeholder="Search By Rule Name"
                  onChange={onChangeSearch}
                  value={search}
                  startIcon={<Icon name="search" />}
                  endIcon={
                    <Icon name="cross" onClick={onHandleClearSearch} className="cursor-pointer hover:text-red-400" />
                  }
                />
              </div>
            </div>
          </div>
        </Section>
        <RuleList rules={rules} getRules={getRules} search={search} page="options" />
      </Section>
    </>
  );
};
