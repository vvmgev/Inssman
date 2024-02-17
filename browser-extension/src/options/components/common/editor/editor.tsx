import { useFormContext } from "react-hook-form";
import MonacoEditor from "../monacoeditor/monacoEditor";
import { EditorLanguage } from "@/models/formFieldModel";

const Editor = () => {
  const methods = useFormContext();
  const language = methods.watch("editorLang") || EditorLanguage.JSON;
  const value = methods.watch("editorValue");
  const handleEditorValueChange = (value) => {
    methods.setValue("editorValue", value);
  };

  return (
    <div className="relative w-full h-full">
      {/* hot fix  */}
      <MonacoEditor onChangeHandler={handleEditorValueChange} language={language} value={value} />
    </div>
  );
};

export default Editor;
