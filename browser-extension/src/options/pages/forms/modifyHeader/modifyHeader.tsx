import Input from "@options/components/common/input/input";
import Select from "@options/components/common/select/select";
import Icon from "@options/components/common/icon/icon";
import FormHOC from "@/options/HOC/formHOC";
import Button from "@/options/components/common/button/button";
import HTTPHeaders from "./HTTPHeaders";
import { HeaderModificationType } from "@models/formFieldModel";
import { useCallback, useEffect } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

import HeaderOperation = chrome.declarativeNetRequest.HeaderOperation;

const modifyHeaderActionOptions = Object.entries(HeaderOperation).reduce((previous: any, [value, label]: any) => {
  previous.push({ value: value.toLowerCase(), label });
  return previous;
}, []);

const modifyHeaderActionOptionsWithoutAppend = Object.entries(HeaderOperation).reduce(
  (previous: any, [value, label]: any) => {
    if (value.toLowerCase() !== HeaderOperation.APPEND) {
      previous.push({ value: value.toLowerCase(), label });
    }
    return previous;
  },
  []
);

const headerModificationTypeOptions = Object.entries(HeaderModificationType).reduce(
  (previous: any, [value, label]: any) => {
    previous.push({ value: value.toLowerCase(), label });
    return previous;
  },
  []
);

const ModifyHeaderForm = () => {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "modifyHeaders",
  });

  const watchFieldArray = watch("modifyHeaders");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const handleRemove = (index) => {
    remove(index);
  };

  const handleAddCondition = useCallback(() => {
    append({ header: "", value: "", operation: HeaderOperation.SET, type: HeaderModificationType.REQUEST });
  }, []);

  useEffect(() => {
    handleAddCondition();
  }, []);

  return (
    <div className="mt-3">
      {controlledFields.map((item, index) => {
        return (
          <div key={item.id} className="flex items-center gap-3">
            <div className="w-24">Operator</div>
            <div className="w-36">
              <Controller
                name={`modifyHeaders.${index}.operation`}
                control={control}
                render={({ field, fieldState }) => {
                  return (
                    <Select
                      options={
                        controlledFields[index].type === HeaderModificationType.RESPONSE
                          ? modifyHeaderActionOptions
                          : modifyHeaderActionOptionsWithoutAppend
                      }
                      error={fieldState.error?.message}
                      {...field}
                    />
                  );
                }}
              />
            </div>
            <div className="w-36">
              <Controller
                name={`modifyHeaders.${index}.type`}
                control={control}
                render={({ field, fieldState }) => {
                  return (
                    <Select options={headerModificationTypeOptions} error={fieldState.error?.message} {...field} />
                  );
                }}
              />
            </div>
            <div className="w-1/4">
              <Controller
                name={`modifyHeaders.${index}.header`}
                control={control}
                render={({ field, fieldState }) => {
                  return (
                    <Select
                      showSearch={true}
                      options={HTTPHeaders[controlledFields[index].type].map((item) => ({
                        value: item,
                        lable: item,
                      }))}
                      placeholder="Key"
                      mode="combobox"
                      error={fieldState.error?.message}
                      {...field}
                    />
                  );
                }}
              />
            </div>
            <div className="w-1/4">
              <Controller
                name={`modifyHeaders.${index}.value`}
                control={control}
                render={({ field, fieldState }) => {
                  return (
                    <Input
                      placeholder="Value"
                      disabled={controlledFields[index].operation === HeaderOperation.REMOVE}
                      hidden={controlledFields[index].operation === HeaderOperation.REMOVE}
                      error={fieldState.error?.message}
                      {...field}
                    />
                  );
                }}
              />
            </div>

            {controlledFields.length > 1 && (
              <Button variant="icon" className="cursor-pointer hover:text-red-400" onClick={() => handleRemove(index)}>
                <Icon name="cross" />
              </Button>
            )}
          </div>
        );
      })}
      <Button size="small" variant="outline" onClick={handleAddCondition} type="button">
        Add Header
      </Button>
    </div>
  );
};

export default FormHOC(ModifyHeaderForm);
