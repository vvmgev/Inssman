import { useMemo } from "react";
import Select from "../select/select";
import Input from "../input/input";
import Editor from "../editor/editor";
import { InjectFileOperator, InjectFileSource, InjectFileType } from "@models/formFieldModel";

const InjectFileSources = ({ onChange, ruleMetaData, error }) => {
  const {
    editorLang,
    editorValue,
    fileSourceType = InjectFileSource.CODE,
    tagSelector,
    tagSelectorOperator,
    fileSource,
  } = ruleMetaData;

  const editorLangOptions = useMemo(
    () =>
      Object.entries(InjectFileType).reduce((previous: any, [value, label]: any) => {
        previous.push({ value: value.toLowerCase(), label });
        return previous;
      }, []),
    []
  );

  const injectFileSourceOptions = useMemo(
    () =>
      Object.entries(InjectFileSource).reduce((previous: any, [value, label]: any) => {
        previous.push({ value: value.toLowerCase(), label });
        return previous;
      }, []),
    []
  );

  const injectFileOperatorOptions = useMemo(
    () =>
      Object.entries(InjectFileOperator).reduce((previous: any, [value, label]: any) => {
        previous.push({ value: value.toLowerCase(), label });
        return previous;
      }, []),
    []
  );

  return (
    <>
      <div className="flex items-center w-full mt-5">
        <span className="mr-5">File Type &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <div className="w-[150px]">
          <Select
            onChange={onChange}
            value={editorLang || "javascript"}
            options={editorLangOptions}
            name="editorLang"
          />
        </div>
        {editorLang !== InjectFileType.HTML && (
          <div className="flex items-center">
            <span className="ml-5 mr-5">Source Type</span>
            <div className="w-[150px]">
              <Select
                onChange={onChange}
                value={fileSourceType || "code"}
                options={injectFileSourceOptions}
                name="fileSourceType"
              />
            </div>
          </div>
        )}
        {editorLang === InjectFileType.HTML && (
          <>
            <span className="ml-5 mr-5">Operator</span>
            <div className="w-1/7">
              <Select
                onChange={onChange}
                value={tagSelectorOperator || "beforebegin"}
                options={injectFileOperatorOptions}
                name="tagSelectorOperator"
              />
            </div>
            <span className="ml-5 mr-5">Tag Selector</span>
            <div className="w-1/3">
              <Input
                value={tagSelector || ""}
                name="tagSelector"
                onChange={onChange}
                placeholder="document.getElementById('app')"
                error={error?.tagSelector}
              />
            </div>
          </>
        )}
      </div>
      {/* <div className="flex items-center w-full mt-5">
            <Checkbox
                name="shouldRemoveHeader"
                label="Remove Header"
                onChange={onChange}
                checked={shouldRemoveHeader}
                />
            </div> */}
      <div
        className={`mt-5 ${
          fileSourceType === InjectFileSource.CODE || editorLang === InjectFileType.HTML ? "" : "hidden"
        }`}
      >
        <Editor value={editorValue} language={editorLang || "javascript"} onChange={onChange} />
      </div>
      {fileSourceType === InjectFileSource.URL && editorLang !== InjectFileType.HTML && (
        <div className="flex items-center w-full mt-5">
          <span className="mr-5">Source URL &nbsp;</span>
          <div className="w-2/3">
            <Input
              value={fileSource || ""}
              name="fileSource"
              onChange={onChange}
              placeholder={`Source URL ( https://example.com/path/to/file )`}
              error={error?.fileSource}
              required
            />
          </div>
        </div>
      )}
    </>
  );
};

export default InjectFileSources;
