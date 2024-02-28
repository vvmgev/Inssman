import MonacoEditor from "@/options/components/common/monacoeditor/monacoEditor";
import { EditorLanguage } from "@/models/formFieldModel";
import { useFormContext } from "react-hook-form";
import { FC } from "react";

type Props = {
  language?: EditorLanguage;
};

const Editor: FC<Props> = ({ language = EditorLanguage.JSON }) => {
  const { setValue, watch } = useFormContext();
  const editorLang = watch("editorLang") || language;
  const value = watch("editorValue");
  const onChange = (value) => setValue("editorValue", value);

  return (
    <div className="relative w-full h-full">
      <MonacoEditor onChange={onChange} language={editorLang} value={value} />
    </div>
  );
};

export default Editor;
