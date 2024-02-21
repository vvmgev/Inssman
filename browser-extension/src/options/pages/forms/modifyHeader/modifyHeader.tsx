import Input from "@options/components/common/input/input";
import Select from "@options/components/common/select/select";
import Icon from "@options/components/common/icon/icon";
import FormHOC from "@/options/HOC/formHOC";
import Button from "@/options/components/common/button/button";
import Switcher from "@/options/components/common/switcher/switcher";
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
  const {
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "headers",
  });

  const watchFieldArray = watch("headers");
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
    append({
      header: "",
      value: "",
      operation: HeaderOperation.SET,
      type: HeaderModificationType.REQUEST,
      enabled: true,
    });
  }, []);

  useEffect(() => {
    const hasEnabledCondition = controlledFields.some(({ enabled }) => enabled);
    if (controlledFields.length) {
      if (!hasEnabledCondition && !errors.customHeadersError) {
        setError("customHeadersError", {
          type: "custom",
          message: "May You Need At Least Enable One Header",
        });
      }

      if (hasEnabledCondition && errors?.customHeadersError) {
        clearErrors("customHeadersError");
      }
    }
  }, [controlledFields]);

  useEffect(() => {
    handleAddCondition();
  }, []);

  return (
    <div className="mt-3">
      {errors?.customHeadersError && <p className="text-red-500">{errors.customHeadersError.message as string}</p>}
      {controlledFields.map((item, index) => {
        const disabled = !controlledFields[index].enabled;
        return (
          <div key={item.id} className="flex items-center gap-3">
            <div className={`w-24 ${disabled ? "text-slate-500" : ""}`}>Operator</div>
            <div className="w-36">
              <Controller
                name={`headers.${index}.operation`}
                control={control}
                render={({ field, fieldState }) => {
                  return (
                    <Select
                      options={
                        controlledFields[index].type === HeaderModificationType.RESPONSE
                          ? modifyHeaderActionOptions
                          : modifyHeaderActionOptionsWithoutAppend
                      }
                      disabled={disabled}
                      error={fieldState.error?.message}
                      {...field}
                    />
                  );
                }}
              />
            </div>
            <div className="w-36">
              <Controller
                name={`headers.${index}.type`}
                control={control}
                render={({ field, fieldState }) => {
                  return (
                    <Select
                      disabled={disabled}
                      options={headerModificationTypeOptions}
                      error={fieldState.error?.message}
                      {...field}
                    />
                  );
                }}
              />
            </div>
            <div className="w-1/4">
              <Controller
                name={`headers.${index}.header`}
                control={control}
                rules={{ required: { value: !disabled, message: "Key Is Required" } }}
                render={({ field, fieldState }) => {
                  return (
                    <Select
                      showSearch={true}
                      disabled={disabled}
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
                name={`headers.${index}.value`}
                control={control}
                render={({ field, fieldState }) => {
                  return (
                    <Input
                      placeholder="Value"
                      disabled={controlledFields[index].operation === HeaderOperation.REMOVE || disabled}
                      hidden={controlledFields[index].operation === HeaderOperation.REMOVE}
                      error={fieldState.error?.message}
                      {...field}
                    />
                  );
                }}
              />
            </div>
            <Controller
              name={`headers.${index}.enabled`}
              control={control}
              render={({ field: { value, ...field } }) => {
                return (
                  <Switcher
                    checked={value}
                    error={errors?.customHeadersError?.message as string | undefined}
                    {...field}
                  />
                );
              }}
            />

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
