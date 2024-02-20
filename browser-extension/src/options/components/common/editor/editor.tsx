import MonacoEditor from "../monacoeditor/monacoEditor";
import { useFormContext } from "react-hook-form";
import { EditorLanguage } from "@/models/formFieldModel";
import { useEffect, useRef, useState } from "react";

const Editor = () => {
  const editorRef = useRef<any>();
  const methods = useFormContext();
  const [editorValueUpdated, setEditorValueUpdated] = useState<boolean>(false);
  const language = methods.watch("editorLang") || EditorLanguage.JSON;
  const value = methods.watch("editorValue") || "";
  const handleEditorValueChange = (value) => methods.setValue("editorValue", value);

  useEffect(() => {
    if (value && !editorValueUpdated) {
      setEditorValueUpdated(true);
      editorRef.current.getModel().setValue(value);
    }
  }, [value, editorValueUpdated]);

  return (
    <div className="relative w-full h-full">
      <MonacoEditor onChangeHandler={handleEditorValueChange} language={language} value={value} ref={editorRef} />
    </div>
  );
};

export default Editor;
