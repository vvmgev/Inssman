import Popup from "reactjs-popup";
import Input from "@options/components/common/input/input";
import Button from "@options/components/common/button/button";
import Section from "@options/components/common/section/section";
import RuleList from "../ruleList/ruleList";
import Icon from "@options/components/common/icon/icon";
import { useState, useRef, useEffect } from "react";
import { PostMessageAction } from "@models/postMessageActionModel";
import { IRuleMetaData } from "@models/formFieldModel";
import { downloadFile } from "@utils/downloadFile";
import { validateJSON } from "@utils/validateJSON";
import { readFile } from "@utils/readFile";
import "reactjs-popup/dist/index.css";

export default () => {
  const importRulesRef = useRef<any>();
  const [search, setSearch] = useState<string>("");
  const [rules, setRules] = useState<IRuleMetaData[]>([]);
  const [importFailed, setImportFailed] = useState<boolean>(false);
  const onHandleClearSearch = () => setSearch("");
  const onChangeSearch = (event) => setSearch(event.target.value);
  const onHandleImport = () => importRulesRef.current.click();
  const getRules = (): void => chrome.runtime.sendMessage({ action: PostMessageAction.GetStorageRules }, setRules);
  const onHandleExportRules = (): void =>
    chrome.runtime.sendMessage({ action: PostMessageAction.ExportRules }, (rules) => downloadFile(rules));
  const onHandleDeleteRules = (close): void =>
    chrome.runtime.sendMessage({ action: PostMessageAction.DeleteRules }, () => {
      close();
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
        setImportFailed(true);
      }
    });
  };

  useEffect(() => getRules(), []);

  return (
    <div className="min-h-[250px]">
      <Popup
        closeOnDocumentClick={true}
        contentStyle={{ background: "transparent", border: "none" }}
        open={importFailed}
        onClose={() => setImportFailed(false)}
        modal
        position="right center"
        overlayStyle={{ backdropFilter: "blur(1.5px)" }}
      >
        {/* @ts-ignore */}
        {(close: any) => (
          <Section classes="bg-opacity-90 py-15">
            <div className="flex pb-5 border-b border-slate-700">
              <div className="flex-1 text-2xl text-slate-200">Import Failed</div>
              <div className="flex justify-end flex-1">
                <span onClick={close} className="w-[30px] cursor-pointer text-slate-200 hover:text-sky-500">
                  <Icon name="cross" />
                </span>
              </div>
            </div>
            <div className="mt-10 text-2xl text-center text-slate-200">You have Invalid JSON file</div>
            <div className="text-base text-center text-slate-500">
              Please make sure you are uploading valid JSON file
            </div>
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
            <div className="flex flex-row items-center justify-center gap-10 text-2xl text-slate-200">
              <Button variant="outline" trackName="invalid JSON Close" className="min-w-[100px]" onClick={close}>
                Close
              </Button>
            </div>
          </Section>
        )}
      </Popup>
      <div className="w-full border text-slate-200 bg-slate-800 bg-opacity-40 border-slate-700">
        <div className="flex items-center justify-between w-full px-6 py-5">
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
            <Popup
              closeOnDocumentClick={true}
              contentStyle={{ background: "transparent", border: "none" }}
              trigger={
                <Button
                  variant="outline"
                  className="hover:text-red-400 hover:border-red-400"
                  trackName="Delete All Rules Popup"
                  startIcon={<Icon name="trash" />}
                >
                  Delete All Rules
                </Button>
              }
              modal
              position="right center"
              overlayStyle={{ backdropFilter: "blur(1.5px)" }}
            >
              {/* @ts-ignore */}
              {(close: any) => (
                <Section classes="bg-opacity-90 py-15 bg-slate-800 bg-opacity-40 rounded-xl">
                  <div className="flex pb-5 border-b border-slate-700">
                    <div className="flex-1 text-2xl text-slate-200">Confirm Deletion</div>
                    <div className="flex justify-end flex-1">
                      <span onClick={close} className="w-[30px] cursor-pointer text-slate-200 hover:text-sky-500">
                        <Icon name="cross" />
                      </span>
                    </div>
                  </div>
                  <div className="my-10 text-2xl text-center text-slate-200">
                    Are you sure want to delete all rules?
                  </div>
                  <div className="flex flex-row items-center justify-center gap-10 text-2xl text-slate-200">
                    <Button
                      variant="outline"
                      trackName="Delete All Rules - NO"
                      className="min-w-[100px]"
                      onClick={close}
                    >
                      No
                    </Button>
                    <Button
                      variant="outline"
                      startIcon={<Icon name="trash" />}
                      className="min-w-[100px] hover:text-red-400 hover:border-red-400"
                      trackName="Delete All Rules - YES"
                      onClick={() => onHandleDeleteRules(close)}
                    >
                      Yes
                    </Button>
                  </div>
                </Section>
              )}
            </Popup>
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
        <div>
          <RuleList rules={rules} getRules={getRules} search={search} page="options" />
        </div>
      </div>
    </div>
  );
};
