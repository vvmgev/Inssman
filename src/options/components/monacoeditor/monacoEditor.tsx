import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import * as monaco from 'monaco-editor';

// @ts-ignore
self.MonacoEnvironment = {
	getWorkerUrl: function (_moduleId: any, label: string) {
		if (label === 'json') {
			return '../json.worker/json.worker.js';
		}
		if (label === 'css' || label === 'scss' || label === 'less') {
			return '../css.worker/css.worker.js';
		}
		if (label === 'html' || label === 'handlebars' || label === 'razor') {
			return '../html.worker/html.worker.js';
		}
		if (label === 'typescript' || label === 'javascript') {
			return '../ts.worker/ts.worker.js';
		}
		return '../editor.worker/editor.worker.js';
	}
};

const MonacoEditor = forwardRef(({ value, language = '', onChangeHandler }: any, ref) => {
	const divEl = useRef<HTMLDivElement>(null);
	let editor = useRef<monaco.editor.IStandaloneCodeEditor>();


	const getModel = () => monaco.editor.getModels()[0];
	const onChange = (...rest) => onChangeHandler && onChangeHandler(rest);
	const setValue = value => getModel().setValue(value);

	useImperativeHandle(ref, () => ({
		getValue: () => monaco.editor.getModels()[0].getValue(),
		setLanguage: (language) => {
			monaco.editor.setModelLanguage(monaco.editor.getModels()[0], language.toLocaleLowerCase())
		},
		getModel,
		onChange,
		pritter: () => editor.current?.getAction('editor.action.formatDocument').run(),
	  }));

	useEffect(() => {
		if (divEl.current) {
			editor.current = monaco.editor.create(divEl.current, {
				value: [value].join('\n'),
				language,
				theme: 'vs-dark',
				autoIndent: 'advanced',
				formatOnPaste: true,
				formatOnType: true,
				minimap: { enabled: false }
			});
		}
		return () => {
			editor.current?.dispose();
		};
	}, []);

	useEffect(() => {
		getModel().onDidChangeContent(onChange)
	}, []);

	useEffect(() => {
		const position: any  = editor.current?.getPosition();
		setValue(value);
		editor.current?.setPosition(position);
	}, [value]);

	return <div className="w-full h-[400px]" ref={divEl}></div>;
});

export default MonacoEditor;