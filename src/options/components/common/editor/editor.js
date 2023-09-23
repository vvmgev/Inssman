import MonacoEditor from '../monacoeditor/monacoEditor';

function Editor({ language, value, onChange = () => {} }) {
  const handleChangeEditor = (value) => {
    onChange({
      target: {
        name: 'editorValue',
        value,
      },
    });
  };

  return (
    <div className="relative w-full h-full">
      <MonacoEditor
        onChangeHandler={handleChangeEditor}
        language={language}
        value={value}
      />
    </div>
  );
}

export default Editor;
