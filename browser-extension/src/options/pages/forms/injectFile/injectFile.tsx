import FormHOC from "@/options/HOC/formHOC";
import Select from "@/options/components/common/select/select";
import Input from "@/options/components/common/input/input";
import Editor from "@/options/components/common/editor/editor";
import { InjectFileOperator, InjectFileSource, InjectFileType } from "@/models/formFieldModel";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect } from "react";

const editorLangOptions = Object.entries(InjectFileType).reduce((previous: any, [value, label]: any) => {
  previous.push({ value: value.toLowerCase(), label });
  return previous;
}, []);

const injectFileSourceOptions = Object.entries(InjectFileSource).reduce((previous: any, [value, label]: any) => {
  previous.push({ value: value.toLowerCase(), label });
  return previous;
}, []);

const injectFileOperatorOptions = Object.entries(InjectFileOperator).reduce((previous: any, [value, label]: any) => {
  previous.push({ value: value.toLowerCase(), label });
  return previous;
}, []);

const InjectFile = () => {
  const { control, setValue, watch } = useFormContext();

  useEffect(() => {
    setValue("editorLang", InjectFileType.JAVASCRIPT);
    setValue("fileSourceType", InjectFileSource.CODE);
    setValue("tagSelectorOperator", InjectFileOperator.AFTERBEGIN);
    setValue("tagSelector", "document.body");
    setValue("fileSource", "");
  }, []);

  const editorLang = watch("editorLang");
  const fileSourceType = watch("fileSourceType");

  return (
    <>
      <div className="flex items-center w-full mt-5">
        <span className="mr-5">File Type</span>
        <div className="w-[150px]">
          <Controller
            name="editorLang"
            control={control}
            render={({ field }) => <Select options={editorLangOptions} {...field} />}
          />
        </div>
        {editorLang !== InjectFileType.HTML && (
          <div className="flex items-center">
            <span className="ml-5 mr-5">Source Type</span>
            <div className="w-[150px]">
              <Controller
                name="fileSourceType"
                control={control}
                render={({ field }) => <Select options={injectFileSourceOptions} {...field} />}
              />
            </div>
          </div>
        )}
        {editorLang === InjectFileType.HTML && (
          <>
            <span className="ml-5 mr-5">Operator</span>
            <div className="w-1/7">
              <Controller
                name="tagSelectorOperator"
                control={control}
                render={({ field }) => <Select options={injectFileOperatorOptions} {...field} />}
              />
            </div>
            <span className="ml-5 mr-5">Tag Selector</span>
            <div className="w-1/3">
              <Controller
                name="tagSelector"
                control={control}
                render={({ field }) => <Input placeholder="document.getElementById('app')" {...field} />}
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
          !fileSourceType || fileSourceType === InjectFileSource.CODE || editorLang === InjectFileType.HTML
            ? ""
            : "hidden"
        }`}
      >
        <Editor />
      </div>
      {fileSourceType === InjectFileSource.URL && editorLang !== InjectFileType.HTML && (
        <div className="flex items-center w-full mt-5">
          <span className="mr-5">Source URL &nbsp;</span>
          <div className="w-2/3">
            <Controller
              name="fileSource"
              control={control}
              render={({ field }) => (
                <Input placeholder={`Source URL ( https://example.com/path/to/file )`} {...field} />
              )}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FormHOC(InjectFile);
