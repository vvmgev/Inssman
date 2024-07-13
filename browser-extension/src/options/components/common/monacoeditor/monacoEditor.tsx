import { useRef, useEffect, FC } from "react";
import * as monaco from "monaco-editor";
import { EditorLanguage } from "@/models/formFieldModel";

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
  language: EditorLanguage;
  onChange?: (data: string) => void;
  value?: string;
};

const MonacoEditor: FC<Props> = ({ language, onChange, value = "" }: any) => {
  const divEl = useRef<HTMLDivElement>(null);
  let editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
  const getModel = () => editorRef.current?.getModel() as monaco.editor.ITextModel;
  const onChangeHandler = () => onChange && onChange(getModel().getValue());
  const pritter = () => editorRef.current?.getAction("editor.action.formatDocument")?.run();

  useEffect(() => {
    editorRef.current = monaco.editor.create(divEl.current as HTMLDivElement, {
      value: "",
      language: "",
      theme: "vs-dark",
      autoIndent: "advanced",
      formatOnPaste: true,
      formatOnType: true,
      contextmenu: false,
      minimap: { enabled: false },
    });
    getModel().onDidChangeContent(onChangeHandler);
  }, []);

  useEffect(() => {
    const model = getModel();
    if (value === model.getValue()) {
      return;
    }

    editorRef.current?.executeEdits("", [
      {
        range: model.getFullModelRange(),
        text: value,
        forceMoveMarkers: true,
      },
    ]);
    editorRef.current?.pushUndoStop();
  }, [value]);

  useEffect(() => monaco.editor.setModelLanguage(getModel(), language), [language]);

  return (
    <>
      <div
        className="absolute top-0 z-10 inline-block px-4 py-2 mt-5 border rounded cursor-pointer right-5 border-slate-500 text-slate-200"
        onClick={pritter}
      >
        Pritter
      </div>
      <div className="w-full h-[400px]" ref={divEl}></div>
    </>
  );
};

export default MonacoEditor;
