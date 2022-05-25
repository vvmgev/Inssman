import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
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

export default forwardRef(({ value, language = '', onChangeHandler }, ref) => {
	const divEl = useRef<HTMLDivElement>(null);
	let editor: monaco.editor.IStandaloneCodeEditor;

	const getModel = () => monaco.editor.getModels()[0];
	const onChange = (...rest) => onChangeHandler && onChangeHandler(rest) 

	useImperativeHandle(ref, () => ({
		getValue: () => monaco.editor.getModels()[0].getValue(),
		setLanguage: (language) => {
			monaco.editor.setModelLanguage(monaco.editor.getModels()[0], language.toLocaleLowerCase())
		},
		getModel,
		onChange,
	  }));

	useEffect(() => {
		if (divEl.current) {
			editor = monaco.editor.create(divEl.current, {
				value: [value].join('\n'),
				language
			});
		}
		return () => {
			editor.dispose();
		};
	}, []);

	useEffect(() => {
		getModel().onDidChangeContent(onChange)
	}, [])

	return <div className="w-full h-[200px]" ref={divEl}></div>;
});