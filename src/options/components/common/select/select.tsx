import { useEffect, useRef } from 'react';
import SlimSelect from 'slim-select'
import { generateUniqueID } from 'src/utils';
import '../../../../../node_modules/slim-select/dist/slimselect.css';
import './select.css'

type Props = {
    value: string | string[];
    name: string;
    options: any;
    onChange: any;
    error?: any;
    classes?: string;
    placeholder?: string;
    multiple?: boolean;
}

const Select = ({value, classes = '', name, options, onChange, error, placeholder, multiple = false}: Props) => {
    const selectRef = useRef<any>();
    const idRef = useRef<string>();

    useEffect(() => {
        idRef.current = `select-${generateUniqueID()}`;
        selectRef.current.id = idRef.current;
        let selectSettings = {};
        if(multiple) {
            selectSettings = {
                allowDeselect: true,
                closeOnSelect: false,
                maxValuesShown: 3,
                maxValuesMessage: '{number} values selected',
            }
        }
        new SlimSelect({
            select: `#${idRef.current}`,
            settings: {
                showSearch: false,
                placeholderText: placeholder,
                ...selectSettings,
            },
            events: {
                afterChange: (data) => {
                    const selectValue = multiple ? data.map(({ value }) => value) : data[0].value;
                    onChange({target: {
                        name,
                        value: selectValue
                    }});
                }
            }
          });
          }, []);

    return <div className={`inline-block w-full ${classes}`}>
        <select className={`w-full capitalize py-3 rounded focus:outline-none active:outline-none border-none focus:shadow-none
            text-slate-200 bg-slate-700/70 ${error ? 'border border-red-500' : 'focus:border-none'}`}
            id={idRef.current}
            name={name}
            multiple={multiple}
            ref={selectRef}
            onChange={() => {}}
            value={value}>
                <option data-placeholder="true"></option>
                {options.map((item, id) => {
                    return <option className="!text-slate-200 my-1" key={id} value={item.value}>{item.label}</option>
                })}
        </select>
    </div>
}
export default Select;
