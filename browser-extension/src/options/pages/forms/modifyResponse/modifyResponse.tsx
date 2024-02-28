import FormHOC from "@/options/HOC/formHOC";
import Editor from "@/options/components/common/editor/editor";
import Select from "@/options/components/common/select/select";
import Checkbox from "@/options/components/common/checkbox/checkbox";
import dynamicCodeTemplate from "./dynamicCodeTemplate";
import { EditorLanguage } from "@/models/formFieldModel";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { ResponseMode } from "./generateModifyResponseRules";

const editorLangOptions = Object.entries(EditorLanguage).reduce((previous: any, [value, label]: any) => {
  previous.push({ value: value.toLowerCase(), label });
  return previous;
}, []);

const ModifyResponseForm = () => {
  const { setValue, control, watch, getValues } = useFormContext();
  const [staticValue, setStaticValue] = useState<string>("");
  const [staticLanguage, setStaticLanguage] = useState<EditorLanguage>(EditorLanguage.JSON);
  const [dynamicValue, setDynamicValue] = useState<string>(dynamicCodeTemplate);
  const [editorValue, editorLang, responseMode] = watch(["editorValue", "editorLang", "responseMode"]);

  useEffect(() => {
    if (responseMode) {
      if (responseMode === ResponseMode.STATIC) {
        setStaticValue(editorValue);
        setValue("editorLang", staticLanguage);
      } else {
        setValue("editorLang", EditorLanguage.JAVASCRIPT);
        setDynamicValue(editorValue);
      }
    }
  }, [editorValue, responseMode]);

  useEffect(() => {
    if (responseMode) {
      if (responseMode === ResponseMode.STATIC) {
        setStaticLanguage(editorLang);
      }
    }
  }, [editorLang]);

  const handleChangeResponseMode = (mode) => {
    if (mode === ResponseMode.STATIC) {
      setValue("editorValue", staticValue);
    } else {
      setValue("editorValue", dynamicValue);
    }
  };

  useEffect(() => {
    setValue("editorLang", staticLanguage);
    setValue("responseMode", ResponseMode.STATIC);
  }, []);

  return (
    <div className="flex flex-col mt-5">
      <div className="flex items-center gap-3">
        <div className="w-24">Response</div>
        <div className="w-36">
          <Controller
            name="editorLang"
            control={control}
            render={({ field, fieldState }) => {
              return (
                <Select
                  disabled={getValues("responseMode") === ResponseMode.DYNAMIC}
                  options={editorLangOptions}
                  error={fieldState.error?.message}
                  {...field}
                />
              );
            }}
          />
        </div>
      </div>
      <div className="flex gap-3">
        <Controller
          name="responseMode"
          control={control}
          render={({ field: { value, onChange, ...field } }) => {
            return (
              <Checkbox
                label="Static Response"
                type="radio"
                checked={value === ResponseMode.STATIC}
                value={ResponseMode.STATIC}
                onChange={(value) => {
                  handleChangeResponseMode(ResponseMode.STATIC);
                  onChange(value);
                }}
                {...field}
              />
            );
          }}
        />
        <Controller
          name="responseMode"
          control={control}
          render={({ field: { value, onChange, ...field } }) => {
            return (
              <Checkbox
                type="radio"
                label={
                  <>
                    Dynamic Response<sup className="ml-1 text-xs text-red-500">Beta</sup>
                  </>
                }
                checked={value === ResponseMode.DYNAMIC}
                value={ResponseMode.DYNAMIC}
                onChange={(value) => {
                  handleChangeResponseMode(ResponseMode.DYNAMIC);
                  onChange(value);
                }}
                {...field}
              />
            );
          }}
        />
      </div>
      <div className="mt-5">
        <Editor />
      </div>
    </div>
  );
};

export default FormHOC(ModifyResponseForm);
