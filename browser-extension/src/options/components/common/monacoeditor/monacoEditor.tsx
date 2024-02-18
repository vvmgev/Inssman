import { useRef, useEffect, forwardRef } from "react";
import * as monaco from "monaco-editor";

// @ts-ignore
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

const MonacoEditor = forwardRef(({ language, onChangeHandler, value = "" }: any, ref: any) => {
  const divEl = useRef<HTMLDivElement>(null);
  let editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
  const getModel = () => editorRef.current?.getModel() as monaco.editor.ITextModel;
  const onChange = () => onChangeHandler && onChangeHandler(getModel().getValue());
  const pritter = () => editorRef.current?.getAction("editor.action.formatDocument").run();

  useEffect(() => {
    editorRef.current = monaco.editor.create(divEl.current as HTMLDivElement, {
      value: "",
      language: "",
      theme: "vs-dark",
      autoIndent: "advanced",
      formatOnPaste: true,
      formatOnType: true,
      minimap: { enabled: false },
    });
    getModel().onDidChangeContent(onChange);
    getModel().setValue(value);
    ref.current = editorRef.current;
  }, []);

  useEffect(() => monaco.editor.setModelLanguage(getModel(), language), [language]);

  return (
    <>
      <div
        className="absolute top-0 z-10 inline-block px-4 py-2 mt-5 border rounded cursor-pointer right-5 border-slate-500 text-slate-200"
        onClick={pritter}
      >
        Pritter
      </div>
      <div className="w-full h-[320px]" ref={divEl}></div>
    </>
  );
});

export default MonacoEditor;
