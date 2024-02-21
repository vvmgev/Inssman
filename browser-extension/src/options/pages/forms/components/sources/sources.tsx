import Input from "@options/components/common/input/input";
import Select from "@options/components/common/select/select";
import Tooltip from "@options/components/common/tooltip/tooltip";
import Switcher from "@/options/components/common/switcher/switcher";
import Icon from "@options/components/common/icon/icon";
import Button from "@options/components/common/button/button";
import { useCallback, useMemo, useEffect } from "react";
import { useFieldArray, Controller, useFormContext } from "react-hook-form";
import { MatchType } from "@models/formFieldModel";

import RequestMethod = chrome.declarativeNetRequest.RequestMethod;
import ResourceType = chrome.declarativeNetRequest.ResourceType;

const matchTypeOptions = Object.entries(MatchType).reduce((previous: any, [value, label]: any) => {
  previous.push({ value: value.toLowerCase(), label });
  return previous;
}, []);

const SourceFields = () => {
  const {
    control,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "conditions",
  });

  const watchFieldArray = watch("conditions");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  useEffect(() => {
    const hasEnabledCondition = controlledFields.some(({ enabled }) => enabled);
    if (controlledFields.length) {
      if (!hasEnabledCondition && !errors.customConditionsError) {
        setError("customConditionsError", {
          type: "custom",
          message: "You Need At Least Enable One Condition.",
        });
      }

      if (hasEnabledCondition && errors?.customConditionsError) {
        clearErrors("customConditionsError");
      }
    }
  }, [controlledFields]);

  useEffect(() => {
    handleAddCondition();
  }, []);

  const requestMethodOptions = useMemo(
    () =>
      Object.entries(RequestMethod).reduce((previous: any, [value, label]: any) => {
        previous.push({ value: value.toLowerCase(), label });
        return previous;
      }, []),
    []
  );

  const resourceTypeOptions = useMemo(
    () =>
      Object.entries(ResourceType).reduce((previous: any, [value, label]: any) => {
        previous.push({
          value: value.toLowerCase(),
          label: label.replace("_", " "),
        });
        return previous;
      }, []),
    []
  );

  const placeholders = useMemo(
    () => ({
      [MatchType.EQUAL]: "e.g http://google.com",
      // [MatchType.REGEXP]: 'e.g ^http(s):\/\/example\.com\/?$',
      [MatchType.WILDCARD]: "e.g. *://google.com/*",
      [MatchType.CONTAIN]: "e.g google",
    }),
    []
  );

  const applyToAllHandler = () => {
    // onChange({target: {name: 'matchType', value: MatchType.WILDCARD}});
    // onChange({target: {name: 'source', value: '*'}});
  };

  const handleAddCondition = useCallback(() => {
    append({ matchType: MatchType.CONTAIN, source: "", enabled: true });
  }, []);

  const handleRemove = (index) => {
    remove(index);
  };

  return (
    <div className="mt-3">
      {errors?.customConditionsError && (
        <p className="text-red-500">{errors.customConditionsError.message as string}</p>
      )}
      {controlledFields?.map((item: any, index) => {
        const disabled = !controlledFields[index].enabled;
        return (
          <div className="flex flex-col w-full gap-1" key={item.id}>
            <div className="flex items-center w-full gap-3">
              <div className={`w-24 ${disabled ? "text-slate-500" : ""}`}>If Request</div>
              <div className="w-36">
                <Controller
                  name={`conditions.${index}.matchType`}
                  control={control}
                  render={({ field, fieldState }) => {
                    return (
                      <Select
                        options={matchTypeOptions}
                        disabled={disabled}
                        error={fieldState.error?.message}
                        {...field}
                      />
                    );
                  }}
                />
              </div>
              <div className="w-2/4">
                <Controller
                  name={`conditions.${index}.source`}
                  control={control}
                  rules={{ required: { value: !disabled, message: "Source Is Required" } }}
                  render={({ field, fieldState }) => {
                    return (
                      <Input
                        disabled={disabled}
                        placeholder={placeholders[item.matchType]}
                        error={fieldState.error?.message}
                        {...field}
                      />
                    );
                  }}
                />
              </div>
              <div>
                <Controller
                  name={`conditions.${index}.enabled`}
                  control={control}
                  render={({ field: { value, ...field } }) => {
                    return (
                      <Switcher
                        checked={value}
                        error={errors?.customConditionsError?.message as string | undefined}
                        {...field}
                      />
                    );
                  }}
                />
              </div>
              <div>
                {controlledFields.length > 1 && (
                  <Button
                    variant="icon"
                    className="cursor-pointer hover:text-red-400"
                    onClick={() => handleRemove(index)}
                  >
                    <Icon name="cross" />
                  </Button>
                )}
              </div>
              {/* {showRequestMethods && showResourceTypes && (
                <div className="ml-1" onClick={toggleFields}>
                  <span
                    className={`w-[35px] cursor-pointer inline-block ${
                      showFields && "text-sky-500"
                    } hover:text-sky-500`}
                  >
                    <Icon name="adjustmentVertical" />
                  </span>
                </div>
              )} */}
              {/* {showAllButton && (
                <div className="w-1/4 ml-5" onClick={applyToAllHandler}>
                  <div className="inline-block px-4 py-2 border rounded cursor-pointer border-slate-700 text-slate-400">
                    Apply to all URLs
                  </div>
                </div>
              )} */}
            </div>
            {/* <div
              className={`${showFields ? "flex" : "hidden"} w-full ${
                showRequestMethods || showResourceTypes ? "mt-5" : ""
              }`}
            > */}
            <div className="min-w-[100px]"></div>
            {/* {showRequestMethods && (
                <div className="min-w-[340px] flex items-center gap-1">
                  <Select
                    onChange={onChange}
                    value={requestMethods}
                    options={requestMethodOptions}
                    name="requestMethods"
                    error={error?.requestMethods}
                    mode="multiple"
                    placeholder="Request Method"
                    {...requestMethodsProps}
                  />
                  <Tooltip content="To Apply All Request Methods Leave Empty">
                    <span className="w-[35px] cursor-pointer inline-block">
                      <Icon name="info" />
                    </span>
                  </Tooltip>
                </div>
              )} */}
            {/* {showResourceTypes && (
                <div className="ml-5 min-w-[340px] flex items-center gap-1">
                  <Select
                    onChange={onChange}
                    value={resourceTypes}
                    options={resourceTypeOptions}
                    name="resourceTypes"
                    error={error?.resourceTypes}
                    mode="multiple"
                    placeholder="Resource Types"
                    {...resourceTypesProps}
                  />
                  <Tooltip content="To Apply All Resource Types Leave Empty">
                    <span className="w-[35px] cursor-pointer inline-block">
                      <Icon name="info" />
                    </span>
                  </Tooltip>
                </div>
              )} */}
            {/* </div> */}
          </div>
        );
      })}
      <Button size="small" variant="outline" onClick={handleAddCondition} type="button">
        Add Condition
      </Button>
    </div>
  );
};

export default SourceFields;
