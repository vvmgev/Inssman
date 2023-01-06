import React, { useMemo } from 'react';
import { QueryParamAction } from 'models/formFieldModel';
import Input from 'components/common/input/input';
import Select from 'components/common/select/select';
import RemoveSVG  from 'assets/icons/remove.svg';

const QueryParamFields = ({ queryParams, onChangeParam, onChangeType, onRemove }) => {

  const queryParamActionOptions = useMemo(() => Object.entries(QueryParamAction).reduce((previous: any, [value, label]: any) => {
    previous.push({value: value.toLowerCase(), label})
    return previous;
  }, []), []);

  return <>
    {queryParams.map((param, index) => {
      return (
        <div key={index} className="flex mt-5 gap-5 items-center">
          <Select
            options={queryParamActionOptions}
            name="queryParamAction"
            value={param.action}
            onChange={onChangeType.bind(null, index)}
            classes="flex-[1]"
          />
          <Input
            value={param.key}
            onChange={onChangeParam.bind(null, 'key', index)}
            placeholder="Key"
            classes="flex-[2]"
          />
          <Input
            value={param.value}
            onChange={onChangeParam.bind(null, 'value', index)}
            disabled={param.action === QueryParamAction.REMOVE}
            placeholder="Value"
            classes="flex-[2]"
          />
          <div className="cursor-pointer" onClick={e => onRemove(e, index)}><RemoveSVG /></div>
        </div>
      )
    })}
  </>
}

export default QueryParamFields;