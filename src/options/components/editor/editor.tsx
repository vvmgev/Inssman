import React, {useRef, useEffect } from 'react';
import MonacoEditor from '../monacoeditor/monacoEditor';

const Editor = ({language, value, onChange}) => {
    const editorRef = useRef<any>();
    const pritter = () => editorRef.current.pritter();

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

    return <div className="relative">
        <div className=" absolute z-10 right-5 top-0 border inline-block mt-5 border-slate-500 rounded py-2 px-4 text-slate-200 cursor-pointer" onClick={pritter}>Pritter</div>
        <MonacoEditor
                onChangeHandler={handleChangeEditor}
                ref={editorRef}
                language={language} value={value || ''} 
        />
    </div>
}

export default Editor;