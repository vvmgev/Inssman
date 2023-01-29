import React from 'react';
import MonacoEditor from '../monacoeditor/monacoEditor';

const Editor = ({language, editorRef, onChange = (data: any) => {}}) => {
    const handleChangeEditor = value => {
        onChange({
            target: {
                name: 'editorValue',
                value,
            }
        })
    }

    return <div className="relative">
        <MonacoEditor
          onChangeHandler={handleChangeEditor}
          ref={editorRef}
          language={language}
        />
    </div>
}

export default Editor;