import React, { useEffect, useRef } from 'react';
import SlimSelect from 'slim-select'
import '../../../../../node_modules/slim-select/dist/slimselect.css';

type Props = {
    value: string;
    name: string;
    options: any;
    onChange: any;
    error?: any;
    classes?: string;
    multiple?: boolean;
}

const Select = ({value, classes = '', name, options, onChange, error, multiple = false}: Props) => {
    const selectRef = useRef<any>();
    const idRef = useRef<string>(`select-${Number(Date.now())}`);

    useEffect(() => {
        new SlimSelect({
            select: `#${idRef.current}`,
            settings: {
                showSearch: false,
            },
            events: {
                afterChange: (value) => {
                    console.log('value', value);
                    const event = new Event('change');
                    selectRef.current.dispatchEvent(event);
                    onChange(event);
                }
            }
          });
    }, [])

    return <div className={`inline-block w-[100px] ${classes}`}>
        <select className={`w-full capitalize py-3 rounded focus:outline-none active:outline-none border-none focus:shadow-none
            text-slate-200 bg-slate-700/50 ${error ? 'border border-red-500' : 'focus:border-none'}`}
            id={idRef.current}
            name={name}
            multiple={multiple}
            ref={selectRef}
            defaultValue={value}>
                {options.map((item, id) => {
                    return <option className="!text-slate-200 my-1" key={id} value={item.value}>{item.label}</option>
                })}
        </select>
    </div>
}
export default Select;