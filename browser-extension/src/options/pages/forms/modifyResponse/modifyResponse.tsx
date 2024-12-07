import FormHOC from "@/options/HOC/formHOC";
import Editor from "@/options/components/common/editor/editor";
import Select from "@/options/components/common/select/select";
import Checkbox from "@/options/components/common/checkbox/checkbox";
import dynamicCodeTemplate from "./dynamicCodeTemplate";
import { EditorLanguage } from "@/models/formFieldModel";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { ModificationType } from "./generateModifyResponseRules";

const editorLangOptions = Object.entries(EditorLanguage).reduce((previous: any, [value, label]: any) => {
  previous.push({ value: value.toLowerCase(), label });
  return previous;
}, []);

const ModifyResponseForm = () => {
  const { setValue, control, watch, getValues } = useFormContext();
  const [staticValue, setStaticValue] = useState<string>("");
  const [staticLanguage, setStaticLanguage] = useState<EditorLanguage>(EditorLanguage.JSON);
  const [dynamicValue, setDynamicValue] = useState<string>(dynamicCodeTemplate);
  const [editorValue, editorLang, modificationType] = watch(["editorValue", "editorLang", "modificationType"]);

  useEffect(() => {
    if (modificationType) {
      if (modificationType === ModificationType.STATIC) {
        setStaticValue(editorValue);
        setValue("editorLang", staticLanguage);
      } else {
        setValue("editorLang", EditorLanguage.JAVASCRIPT);
        setDynamicValue(editorValue);
      }
    }
  }, [editorValue, modificationType]);

  useEffect(() => {
    if (modificationType) {
      if (modificationType === ModificationType.STATIC) {
        setStaticLanguage(editorLang);
      }
    }
  }, [editorLang]);

  const handleChangeResponseMode = (mode) => {
    if (mode === ModificationType.STATIC) {
      setValue("editorValue", staticValue, { shouldDirty: true });
    } else {
      setValue("editorValue", dynamicValue, { shouldDirty: true });
    }
  };

  useEffect(() => {
    setValue("editorLang", staticLanguage);
    setValue("modificationType", ModificationType.STATIC);
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
                  disabled={getValues("modificationType") === ModificationType.DYNAMIC}
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
          name="modificationType"
          control={control}
          render={({ field: { value, onChange, ...field } }) => {
            return (
              <Checkbox
                label="Static Response"
                type="radio"
                checked={value === ModificationType.STATIC}
                value={ModificationType.STATIC}
                onChange={(value) => {
                  handleChangeResponseMode(ModificationType.STATIC);
                  onChange(value);
                }}
                {...field}
              />
            );
          }}
        />
        <Controller
          name="modificationType"
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
                checked={value === ModificationType.DYNAMIC}
                value={ModificationType.DYNAMIC}
                onChange={(value) => {
                  handleChangeResponseMode(ModificationType.DYNAMIC);
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
