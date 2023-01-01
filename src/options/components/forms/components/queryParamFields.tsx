import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { QueryParamAction } from 'src/models/formFieldModel';
import Input from '../../common/input/input';
import Select from '../../common/select/select';

const QueryParamFields = ({ queryParams, onChangeParam, onChangeType }) => {

  const queryParamActionOptions = useMemo(() => Object.entries(QueryParamAction).reduce((previous: any, [value, label]: any) => {
    previous.push({value: value.toLowerCase(), label})
    return previous;
  }, []), []);

  return <>
    {queryParams.map((param, index) => {
      return (
        <div key={index}>
          <Select
            options={queryParamActionOptions}
            name="queryParamAction"
            value={param.action}
            onChange={onChangeType.bind(null, index)}
          />
          <Input
            value={param.key}
            onChange={onChangeParam.bind(null, 'key', index)} 
          />
          <Input
            value={param.value}
            onChange={onChangeParam.bind(null, 'value', index)}
            disabled={param.action === QueryParamAction.REMOVE}
          />
        </div>
      )
    })}
  </>
}

export default QueryParamFields;