import FormHOC from "@/options/HOC/formHOC";
import Editor from "@/options/components/common/editor/editor";
import Checkbox from "@/options/components/common/checkbox/checkbox";
import { Controller, useFormContext } from "react-hook-form";
// import { ModificationType } from "../modifyResponse/generateModifyResponseRules";
import { useEffect, useState } from "react";
import { EditorLanguage } from "@/models/formFieldModel";
import dynamicCodeTemplate from "../modifyResponse/dynamicCodeTemplate";

const ModifyRequestBody = () => {
  const { setValue, control, watch } = useFormContext();
  const [staticValue, setStaticValue] = useState<string>("");
  const [staticLanguage, setStaticLanguage] = useState<EditorLanguage>(EditorLanguage.JSON);
  const [dynamicValue, setDynamicValue] = useState<string>(dynamicCodeTemplate);
  const [editorValue, editorLang, modificationType] = watch(["editorValue", "editorLang", "modificationType"]);

  useEffect(() => {
    if (modificationType) {
      if (modificationType === "static") {
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
      if (modificationType === "static") {
        setStaticLanguage(editorLang);
      }
    }
  }, [editorLang]);

  const handleChangeResponseMode = (mode) => {
    if (mode === "static") {
      setValue("editorValue", staticValue, { shouldDirty: true });
    } else {
      setValue("editorValue", dynamicValue, { shouldDirty: true });
    }
  };

  useEffect(() => {
    setValue("editorLang", staticLanguage);
    setValue("modificationType", "static");
  }, []);

  return (
    <div className="flex flex-col w-full mt-5">
      <div className="flex gap-3">
        <Controller
          name="modificationType"
          control={control}
          render={({ field: { value, onChange, ...field } }) => {
            return (
              <Checkbox
                label="Static Response"
                type="radio"
                checked={value === "static"}
                value={"static"}
                onChange={(value) => {
                  handleChangeResponseMode("static");
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
                checked={value === "dynamic"}
                value={"dynamic"}
                onChange={(value) => {
                  handleChangeResponseMode("dynamic");
                  onChange(value);
                }}
                {...field}
              />
            );
          }}
        />
      </div>
      <Editor />
    </div>
  );
};

export default FormHOC(ModifyRequestBody);
