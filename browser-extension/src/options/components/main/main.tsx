import { useState, useRef, useEffect } from "react";
import Popup from "reactjs-popup";
import Input from "common/input/input";
import BackButton from "common/backButton/backButton";
import OutlineButton from "common/outlineButton/outlineButton";
import ColorCover from "common/colorCover/colorCover";
import RuleList from "../ruleList/ruleList";
import CrossSVG from "assets/icons/cross.svg";
import SearchSVG from "assets/icons/search.svg";
import ArrowDownLongSVG from "assets/icons/arrowDownLong.svg";
import ArrowUpLongSVG from "assets/icons/arrowUpLong.svg";
import TrashSVG from "assets/icons/trash.svg";
import ListSVG from "assets/icons/list.svg";
import { PostMessageAction } from "models/postMessageActionModel";
import { downloadFile } from "src/utils/downloadFile";
import { validateJSON } from "src/utils/validateJSON";
import { readFile } from "src/utils/readFile";
import { IRuleMetaData } from "src/models/formFieldModel";
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
    <div className="min-h-[250px] overflow-hidden mx-[5%]">
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
          <ColorCover classes="bg-opacity-90 py-15">
            <div className="flex pb-5 border-b border-slate-700">
              <div className="flex-1 text-2xl text-slate-200">Import Failed</div>
              <div className="flex justify-end flex-1">
                <span onClick={close} className="w-[30px] cursor-pointer text-slate-200 hover:text-sky-500">
                  <CrossSVG />
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
              <OutlineButton trackName="invalid JSON Close" classes="min-w-[100px]" onClick={close}>
                Close
              </OutlineButton>
            </div>
          </ColorCover>
        )}
      </Popup>
      <div className="w-full border rounded-tr-3xl rounded-bl-xl rounded-br-xl text-slate-200 rounded-tl-3xl bg-slate-800 bg-opacity-40 border-slate-700">
        <div className="py-5 max-h-[90%] w-full flex justify-between items-center px-6">
          <span className="flex flex-row items-center gap-2 text-lg">
            <span className="w-[24px]">{<ListSVG />}</span>
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
              <OutlineButton onClick={onHandleImport} trackName="Import rules" icon={<ArrowDownLongSVG />}>
                Import
              </OutlineButton>
            </div>
            <div>
              <OutlineButton onClick={onHandleExportRules} trackName="Export rules" icon={<ArrowUpLongSVG />}>
                Export
              </OutlineButton>
            </div>
            <Popup
              closeOnDocumentClick={true}
              contentStyle={{ background: "transparent", border: "none" }}
              trigger={
                <OutlineButton
                  classes="hover:text-red-400 hover:border-red-400"
                  trackName="Delete All Rules Popup"
                  icon={<TrashSVG />}
                >
                  Delete All Rules
                </OutlineButton>
              }
              modal
              position="right center"
              overlayStyle={{ backdropFilter: "blur(1.5px)" }}
            >
              {/* @ts-ignore */}
              {(close: any) => (
                <ColorCover classes="bg-opacity-90 py-15">
                  <div className="flex pb-5 border-b border-slate-700">
                    <div className="flex-1 text-2xl text-slate-200">Confirm Deletion</div>
                    <div className="flex justify-end flex-1">
                      <span onClick={close} className="w-[30px] cursor-pointer text-slate-200 hover:text-sky-500">
                        <CrossSVG />
                      </span>
                    </div>
                  </div>
                  <div className="my-10 text-2xl text-center text-slate-200">
                    Are you sure want to delete all rules?
                  </div>
                  <div className="flex flex-row items-center justify-center gap-10 text-2xl text-slate-200">
                    <OutlineButton trackName="Delete All Rules - NO" classes="min-w-[100px]" onClick={close}>
                      No
                    </OutlineButton>
                    <OutlineButton
                      icon={<TrashSVG />}
                      classes="min-w-[100px] hover:text-red-400 hover:border-red-400"
                      trackName="Delete All Rules - YES"
                      onClick={() => onHandleDeleteRules(close)}
                    >
                      Yes
                    </OutlineButton>
                  </div>
                </ColorCover>
              )}
            </Popup>
            <div className="text-sm">
              <Input
                placeholder="Search By Rule Name"
                onChange={onChangeSearch}
                value={search}
                starts={
                  <span className="w-[24px]">
                    <SearchSVG />
                  </span>
                }
                ends={
                  <span onClick={onHandleClearSearch} className="w-[24px] hover:text-red-400 cursor-pointer">
                    <CrossSVG />
                  </span>
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
