import React, { useMemo } from 'react';
import { HeaderModificationType } from 'models/formFieldModel';
import Input from '../../common/input/input';
import Select from '../../common/select/select';
import RemoveSVG  from 'assets/icons/remove.svg';
import HeaderOperation = chrome.declarativeNetRequest.HeaderOperation

const ModifyHeaderFields = ({ headers, onChangeHeader, onRemoveHeader }) => {
  const modifyHeaderActionOptions = useMemo(() => Object.entries(HeaderOperation).reduce((previous: any, [value, label]: any) => {
    previous.push({value: value.toLowerCase(), label})
    return previous;
  }, []), []);

  const headerModificationTypeOptions = useMemo(() => Object.entries(HeaderModificationType).reduce((previous: any, [value, label]: any) => {
    previous.push({value: value.toLowerCase(), label})
    return previous;
  }, []), []);

  return <>
    {headers.map((header, index) => {
      return (
        <div key={index} className="flex items-center mt-5 w-3/3 gap-5">
          <Select
            options={modifyHeaderActionOptions}
            name="operation"
            value={header.operation}
            onChange={event => onChangeHeader(event, index)}
            classes="flex-[1]"
          />
          <Select
            options={headerModificationTypeOptions}
            name="type"
            value={header.type}
            onChange={event => onChangeHeader(event, index)}
            classes="flex-[1]"
          />
          <Input
            name="header"
            placeholder="Key"
            value={header.header}
            onChange={event => onChangeHeader(event, index)}
            classes="flex-[2]"
          />
          <Input
            name="value"
            placeholder="Value"
            value={header.value}
            onChange={event => onChangeHeader(event, index)}
            disabled={header.operation === HeaderOperation.REMOVE}
            classes="flex-[2]"
          />
          <div className="cursor-pointer" onClick={e => onRemoveHeader(e, index)}><RemoveSVG /></div>
        </div>
      )
    })}
  </>
}

export default ModifyHeaderFields;