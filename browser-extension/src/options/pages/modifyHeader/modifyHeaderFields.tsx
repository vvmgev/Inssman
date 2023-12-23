import { HeaderModificationType } from "@models/formFieldModel";
import Input from "@options/components/common/input/input";
import Select from "@options/components/common/select/select";
import InputAutocomplete from "@options/components/common/InputAutocomplete/inputAutocomplete";
import CrossSVG from "@assets/icons/cross.svg";
import HTTPHeaders from "./HTTPHeaders";
import { generateUniqueID } from "@utils/generateUniqueID";
import { useMemo } from "react";
import HeaderOperation = chrome.declarativeNetRequest.HeaderOperation;

const ModifyHeaderFields = ({
  headers,
  onChangeHeader,
  onRemoveHeader,
  error,
}) => {
  const modifyHeaderActionOptions = useMemo(
    () =>
      Object.entries(HeaderOperation).reduce(
        (previous: any, [value, label]: any) => {
          previous.push({ value: value.toLowerCase(), label });
          return previous;
        },
        []
      ),
    []
  );

  const modifyHeaderActionOptionsWithoutAppend = useMemo(
    () =>
      Object.entries(HeaderOperation).reduce(
        (previous: any, [value, label]: any) => {
          if (value.toLowerCase() !== HeaderOperation.APPEND) {
            previous.push({ value: value.toLowerCase(), label });
          }
          return previous;
        },
        []
      ),
    []
  );

  const headerModificationTypeOptions = useMemo(
    () =>
      Object.entries(HeaderModificationType).reduce(
        (previous: any, [value, label]: any) => {
          previous.push({ value: value.toLowerCase(), label });
          return previous;
        },
        []
      ),
    []
  );

  const headerErrors = useMemo(() => {
    const errors = {};
    for (const index in error?.headers) {
      const header = error?.headers[index]?.header;
      const value = error?.headers[index]?.value;
      errors[index] = { header, value };
    }
    return errors;
  }, [error]);

  const onChangeHandler = (event, index) => {
    if (
      event.target.name === "type" &&
      event.target.value === HeaderModificationType.REQUEST &&
      headers[index].operation === HeaderOperation.APPEND
    ) {
      // replace "Append" to "Set" when type of request changes
      onChangeHeader(
        {
          target: {
            name: "operation",
            value: HeaderOperation.SET,
          },
        },
        index
      );
    }
    onChangeHeader(event, index);
  };

  return (
    <>
      {headers.map((header, index) => {
        return (
          <div key={index} className="flex items-center mt-5">
            <span className="min-w-[100px]">Operator</span>
            <div key={index} className="flex items-center w-full gap-5">
              <Select
                options={
                  header.type === HeaderModificationType.RESPONSE
                    ? modifyHeaderActionOptions
                    : modifyHeaderActionOptionsWithoutAppend
                }
                name="operation"
                value={header.operation}
                onChange={(event) => onChangeHandler(event, index)}
                classes="flex-[1]"
                error={error?.operation}
                key={generateUniqueID()}
              />
              <Select
                options={headerModificationTypeOptions}
                name="type"
                value={header.type}
                onChange={(event) => onChangeHandler(event, index)}
                classes="flex-[1]"
                error={error?.type}
                key={generateUniqueID()}
              />
              <div className="flex-[2]">
                <InputAutocomplete
                  inputProps={{
                    name: "header",
                    placeholder: "Key",
                    value: header.header,
                    onChange: (event) => onChangeHandler(event, index),
                    classes: "flex-[2]",
                    error: headerErrors[index]?.header,
                  }}
                  id={index}
                  list={HTTPHeaders[header.type]}
                />
              </div>
              <Input
                name="value"
                placeholder="Value"
                value={header.value}
                onChange={(event) => onChangeHandler(event, index)}
                disabled={header.operation === HeaderOperation.REMOVE}
                hidden={header.operation === HeaderOperation.REMOVE}
                classes="flex-[2]"
              />
              <div
                className="cursor-pointer"
                onClick={(e) => onRemoveHeader(e, index)}
              >
                <span className="w-[24px] inline-block">
                  <CrossSVG />
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ModifyHeaderFields;
