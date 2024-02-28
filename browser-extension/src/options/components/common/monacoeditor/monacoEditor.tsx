import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { loader } from "@monaco-editor/react";
import { EditorLanguage } from "@/models/formFieldModel";
import { useRef, forwardRef } from "react";

loader.config({ monaco });

self.MonacoEnvironment = {
  getWorkerUrl: function (_moduleId: any, label: string) {
    if (label === "json") {
      return "../json.worker/json.worker.js";
    }
    if (label === "css" || label === "scss" || label === "less") {
      return "../css.worker/css.worker.js";
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return "../html.worker/html.worker.js";
    }
    if (label === "typescript" || label === "javascript") {
      return "../ts.worker/ts.worker.js";
    }
    return "../editor.worker/editor.worker.js";
  },
};

type Props = {
  value: string;
  language: EditorLanguage;
  onChange: any;
};

const MonacoEditor = forwardRef(({ language, onChange, value = "" }: Props, ref: any) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
  const handleEditorDidMount = (editor) => (editorRef.current = editor);
  const pritter = () => editorRef.current?.getAction?.("editor.action.formatDocument")?.run?.();

  return (
    <>
      <div
        className="absolute top-0 z-10 inline-block px-4 py-2 mt-5 border rounded cursor-pointer right-5 border-slate-500 text-slate-200"
        onClick={pritter}
      >
        Pritter
      </div>
      <Editor
        onMount={handleEditorDidMount}
        value={value}
        className="w-full h-[320px]"
        language={language}
        onChange={onChange}
        options={{
          value: "",
          language: "",
          theme: "vs-dark",
          autoIndent: "advanced",
          formatOnPaste: true,
          formatOnType: true,
          minimap: { enabled: false },
        }}
      />
    </>
  );
});

export default MonacoEditor;
