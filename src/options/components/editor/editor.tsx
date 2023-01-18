import React, {useRef } from 'react';
import MonacoEditor from '../monacoeditor/monacoEditor';

const Editor = ({language, value, onChange}) => {
    const editorRef = useRef<any>();
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
          value={value || ''} 
        />
    </div>
}

export default Editor;