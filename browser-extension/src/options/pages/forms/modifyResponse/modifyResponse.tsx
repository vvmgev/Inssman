import FormHOC from "@/options/HOC/formHOC";
import Editor from "@/options/components/common/editor/editor";
import Select from "@/options/components/common/select/select";
import { EditorLanguage } from "@/models/formFieldModel";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect } from "react";

const editorLangOptions = Object.entries(EditorLanguage).reduce((previous: any, [value, label]: any) => {
  previous.push({ value: value.toLowerCase(), label });
  return previous;
}, []);

const ModifyResponseForm = () => {
  const methods = useFormContext();

  useEffect(() => {
    methods.setValue("editorLang", EditorLanguage.JSON);
  }, []);

  return (
    <div className="flex flex-col mt-5">
      <div className="flex items-center gap-3">
        <div className="w-24">Response</div>
        <div className="w-36">
          <Controller
            name="editorLang"
            control={methods.control}
            render={({ field, fieldState }) => {
              return <Select options={editorLangOptions} error={fieldState.error?.message} {...field} />;
            }}
          />
        </div>
      </div>
      <div className="mt-5">
        <Editor />
      </div>
    </div>
  );
};

export default FormHOC(ModifyResponseForm);
