import React, {useRef, useEffect } from 'react';
import MonacoEditor from '../monacoeditor/monacoEditor';

const Editor = ({language, value, onChange}) => {
    const editorRef = useRef<any>();

    useEffect(() => {
        if(language) {
            editorRef.current.setLanguage(language);
        }
    }, [language]);


    const handleChangeEditor = () => {
        onChange({
            target: {
                name: 'editor',
                value: editorRef.current.getValue()
            }
        })
    }

    return <MonacoEditor
            onChangeHandler={handleChangeEditor}
            ref={editorRef}
            language={language} value={value || ''} 
    />
}

export default Editor;