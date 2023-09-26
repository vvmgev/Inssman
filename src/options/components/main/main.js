import { useEffect, useState, useRef } from 'react';
import Popup from 'reactjs-popup';
import Input from 'components/common/input/input';
import OutlineButton from 'components/common/outlineButton/outlineButton';
import ColorCover from 'components/common/colorCover/colorCover';
import CrossSVG from 'assets/icons/cross.svg';
import SearchSVG from 'assets/icons/search.svg';
import ArrowDownLongSVG from 'assets/icons/arrowDownLong.svg';
import ArrowUpLongSVG from 'assets/icons/arrowUpLong.svg';
import TrashSVG from 'assets/icons/trash.svg';
import ListSVG from 'assets/icons/list.svg';
import { PostMessageAction } from 'models/postMessageActionModel';
import { downloadFile } from 'src/utils/downloadFile';
import { validateJSON } from 'src/utils/validateJSON';
import { readFile } from 'src/utils/readFile';
import RuleList from '../ruleList/ruleList';
import 'reactjs-popup/dist/index.css';

const Main = () => {
  const importRulesRef = useRef();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [importFailed, setImportFailed] = useState(false);
  const onHandleClearSearch = () => setSearch('');
  const onChangeSearch = (event) => setSearch(event.target.value);
  const onHandleImport = () => importRulesRef.current.click();
  const onHandleDeleteRules = () => chrome.runtime.sendMessage({ action: PostMessageAction.DeleteRules }, () => getData());
  const onHandleExportRules = () => chrome.runtime.sendMessage({ action: PostMessageAction.ExportRules }, (rules) => downloadFile(rules));
  const getData = () => chrome.runtime.sendMessage({ action: PostMessageAction.GetStorageRules }, setData);
  useEffect(() => getData(), []);

  const onHandleUploadFile = (event) => {
    readFile(event.target.files[0], (fileContent) => {
      if (validateJSON(fileContent)) {
        const data = JSON.parse(fileContent);
        chrome.runtime.sendMessage({ action: PostMessageAction.ImportRules, data }, () => getData());
      } else {
        setImportFailed(true);
      }
    });
  };

  return (
    <div className="min-h-[250px] overflow-hidden mx-[5%]">
      <Popup
        closeOnDocumentClick
        contentStyle={{ background: 'transparent', border: 'none' }}
        open={importFailed}
        onClose={() => setImportFailed(false)}
        modal
        position="right center"
      >
        {(close) => (
          <ColorCover classes="bg-opacity-90 py-15">
            <div className="flex border-b border-slate-700 pb-5">
              <div className="text-slate-200 text-2xl flex-1">Import Failed</div>
              <div className="flex justify-end flex-1">
                <span onClick={close} className="w-[30px] cursor-pointer text-slate-200 hover:text-sky-500"><CrossSVG /></span>
              </div>
            </div>
            <div className="text-slate-200 text-2xl text-center mt-10">You have Invalid JSON file</div>
            <div className="text-slate-500 text-base text-center">Please make sure you are uploading valid JSON file</div>
            <div className="text-slate-500 text-base text-center mb-10">
              You can validate by this service &nbsp;
              <a className="text-sky-500 cursor-pointer underline" href="https://codebeautify.org/jsonvalidator" target="_black">Codebeautify.org</a>
            </div>
            <div className="flex flex-row text-slate-200 text-2xl items-center justify-center gap-10">
              <OutlineButton trackName="invalid JSON Close" classes="min-w-[100px]" onClick={close}>Close</OutlineButton>
            </div>
          </ColorCover>
        )}
      </Popup>
      <div className="w-full rounded-tr-3xl rounded-bl-xl rounded-br-xl text-slate-200 rounded-tl-3xl bg-slate-800 bg-opacity-40 border border-slate-700">
        {data.length ? (
          <>
            <div className="text-lg py-5 max-h-[90%] w-full flex justify-between items-center px-6">
              <span className="flex flex-row items-center gap-2">
                <span className="w-[24px]"><ListSVG /></span>
                <span>All Rules</span>
              </span>
              <div className="flex items-center gap-5">
                <div>
                  <input type="file" onChange={onHandleUploadFile} ref={importRulesRef} className="hidden" accept="application/JSON" />
                  <OutlineButton onClick={onHandleImport} trackName="Import rules" icon={<ArrowDownLongSVG />}>Import</OutlineButton>
                </div>
                <div><OutlineButton onClick={onHandleExportRules} trackName="Export rules" icon={<ArrowUpLongSVG />}>Export</OutlineButton></div>
                <Popup
                  closeOnDocumentClick
                  contentStyle={{ background: 'transparent', border: 'none' }}
                  trigger={<div><OutlineButton classes="hover:text-red-400 hover:border-red-400" trackName="Delete All Rules Popup" icon={<TrashSVG />}>Delete All Rules</OutlineButton></div>}
                  modal
                  position="right center"
                >
                  {(close) => (
                    <ColorCover classes="bg-opacity-90 py-15">
                      <div className="flex border-b border-slate-700 pb-5">
                        <div className="text-slate-200 text-2xl flex-1">Confirm Deletion</div>
                        <div className="flex justify-end flex-1">
                          <span onClick={close} className="w-[30px] cursor-pointer text-slate-200 hover:text-sky-500"><CrossSVG /></span>
                        </div>
                      </div>
                      <div className="text-slate-200 text-2xl text-center my-10">Are you sure you want to delete all rules?</div>
                      <div className="flex flex-row text-slate-200 text-2xl items-center justify-center gap-10">
                        <OutlineButton trackName="Delete All Rules - NO" classes="min-w-[100px]" onClick={close}>No</OutlineButton>
                        <OutlineButton icon={<TrashSVG />} classes="min-w-[100px] hover:text-red-400 hover:border-red-400" trackName="Delete All Rules - YES" onClick={onHandleDeleteRules}>Yes</OutlineButton>
                      </div>
                    </ColorCover>
                  )}
                </Popup>
                <div className="text-sm">
                  <Input
                    placeholder="Search By Rule Name"
                    onChange={onChangeSearch}
                    value={search}
                    starts={<span className="w-[24px]"><SearchSVG /></span>}
                    ends={<span onClick={onHandleClearSearch} className="w-[24px] hover:text-red-400 cursor-pointer"><CrossSVG /></span>}
                  />
                </div>
              </div>
            </div>
            <div>
              <RuleList search={search} />
            </div>
          </>
        )
          : (
            <div className="w-full h-full p-5">
              <div className="flex justify-between">
                <p className="text-2xl">👋 Welcome to Inssman!</p>
                <div className="text-base">
                  <input type="file" onChange={onHandleUploadFile} ref={importRulesRef} className="hidden" accept="application/JSON" />
                  <OutlineButton onClick={onHandleImport} trackName="Import rules" icon={<ArrowDownLongSVG />}>Import Rules</OutlineButton>
                </div>
              </div>

              <p className="mt-5 text-lg">Creating a rule gives you control over HTTP requests and responses.</p>
              <p>With Inssman you can easly do following</p>
              <ul className="ml-3 mt-3 list-disc">
                <li className="mt-1">Redirect any type of request</li>
                <li className="mt-1">Block requests</li>
                <li className="mt-1">Add/remove/replace query parameters</li>
                <li className="mt-1">Add/remove/replace/append request headers</li>
                <li className="mt-1">Add/remove/replace/append response headers</li>
                <li className="mt-1">Return custom HTML/CSS/JS/JSON file as a response</li>
                <li className="mt-1">HTTP Logger for request/response headers</li>
                <li className="mt-1">Modify request body</li>
                <li className="mt-1">Inject custom HTML/CSS/JavaScript file</li>
                <li className="mt-1">Delay request (comming soon)</li>
              </ul>
            </div>
          )}
      </div>
    </div>
  );
}

export default Main;
