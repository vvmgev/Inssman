// import React, { FC, useEffect } from 'react';
// import Editor from '@monaco-editor/react';

// export default (): FC => {

//     useEffect(() => {
//         fetch('https://google.com')
//     }, [])


//     // return <>
//     //     <h1>asdasd</h1>
//     // </>

//     return <Editor
//         height="90vh"
//         defaultLanguage="javascript"
//         defaultValue="// some comment"
//     />
// }











import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';

// @ts-ignore
self.MonacoEnvironment = {
	getWorkerUrl: function (_moduleId: any, label: string) {
		if (label === 'json') {
			return './json.worker.bundle.js';
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return './css.worker.bundle.js';
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return './html.worker.bundle.js';
		}
		if (label === 'typescript' || label === 'javascript') {
			return './ts.worker.bundle.js';
		}
		return './editor.worker.bundle.js';
	}
};

export default () => {
	const divEl = useRef<HTMLDivElement>(null);
	let editor: monaco.editor.IStandaloneCodeEditor;
	useEffect(() => {
		if (divEl.current) {
			editor = monaco.editor.create(divEl.current, {
				value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
				language: 'typescript'
			});
		}
		return () => {
			editor.dispose();
		};
	}, []);
	return <div className="Editor" height={'1111px'} ref={divEl}></div>;
};