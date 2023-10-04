import MonacoEditor from '../monacoeditor/monacoEditor';

const Editor = ({language, value, onChange = (data) => {}}) => {
    const handleChangeEditor = value => {
        onChange({
            target: {
                name: 'editorValue',
                value,
            }
        })
    }

    return <div className="relative w-full h-full">
        <MonacoEditor
          onChangeHandler={handleChangeEditor}
          language={language}
          value={value}
        />
    </div>
}

export default Editor;