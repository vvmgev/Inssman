import React, { useMemo } from 'react';
import { QueryParamAction } from 'models/formFieldModel';
import Input from 'components/common/input/input';
import Select from 'components/common/select/select';
import CrossSVG  from 'assets/icons/cross.svg';

const QueryParamFields = ({ queryParams, onChangeParam, onRemove, error }) => {
  console.log('QueryParamFields', queryParams);

  const queryParamActionOptions = useMemo(() => Object.entries(QueryParamAction).reduce((previous: any, [value, label]: any) => {
    previous.push({value: value.toLowerCase(), label})
    return previous;
  }, []), []);

  return <>
    {queryParams.map((param, index) => {
      return (
        <div key={index} className="flex mt-5 gap-5 items-center">
          <span className="mr-4">Operator&nbsp;</span>
          <Select
            options={queryParamActionOptions}
            name="action"
            value={param.action}
            onChange={event => onChangeParam(event, index)}
            classes="flex-[1]"
            error={error?.queryParamAction}
          />
          <Input
            name="key"
            value={param.key}
            onChange={event => onChangeParam(event, index)}
            placeholder="Key"
            classes="flex-[3]"
          />
          <Input
            name="value"
            value={param.value}
            onChange={event => onChangeParam(event, index)}
            disabled={param.action === QueryParamAction.REMOVE}
            hidden={param.action === QueryParamAction.REMOVE}
            placeholder="Value"
            classes="flex-[3]"
          />
          <div className="cursor-pointer" onClick={event => onRemove(event, index)}><span className="w-[24px] inline-block"><CrossSVG /></span></div>
        </div>
      )
    })}
  </>
}

export default QueryParamFields;