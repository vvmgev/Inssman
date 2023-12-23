import { useMemo } from "react";
import { QueryParamAction } from "models/formFieldModel";
import Input from "components/common/input/input";
import Select from "components/common/select/select";
import CrossSVG from "assets/icons/cross.svg";
import { generateUniqueID } from "src/utils";

const QueryParamFields = ({ queryParams, onChangeParam, onRemove, error }) => {
  const queryParamActionOptions = useMemo(
    () =>
      Object.entries(QueryParamAction).reduce((previous: any, [value, label]: any) => {
        previous.push({ value: value.toLowerCase(), label });
        return previous;
      }, []),
    []
  );

  const queryParamsErrors = useMemo(() => {
    const errors = {};
    for (const index in error?.queryParams) {
      const key = error?.queryParams[index]?.key;
      const value = error?.queryParams[index]?.value;
      errors[index] = { key, value };
    }
    return errors;
  }, [error]);

  return (
    <>
      {queryParams.map((param, index) => {
        return (
          <div key={index} className="flex items-center mt-5 gap-5">
            <span className="mr-4">Operator&nbsp;</span>
            <Select
              options={queryParamActionOptions}
              name="action"
              value={param.action}
              onChange={(event) => onChangeParam(event, index)}
              classes="flex-[1]"
              error={error?.queryParamAction}
              key={generateUniqueID()}
            />
            <Input
              name="key"
              value={param.key}
              onChange={(event) => onChangeParam(event, index)}
              placeholder="Key"
              classes="flex-[3]"
              error={queryParamsErrors[index]?.key}
            />
            <Input
              name="value"
              value={param.value}
              onChange={(event) => onChangeParam(event, index)}
              disabled={param.action === QueryParamAction.REMOVE}
              hidden={param.action === QueryParamAction.REMOVE}
              placeholder="Value"
              classes="flex-[3]"
            />
            <div className="cursor-pointer" onClick={(event) => onRemove(event, index)}>
              <span className="w-[24px] inline-block">
                <CrossSVG />
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default QueryParamFields;
