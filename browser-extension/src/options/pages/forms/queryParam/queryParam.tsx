import Input from "@options/components/common/input/input";
import Select from "@options/components/common/select/select";
import Icon from "@options/components/common/icon/icon";
import FormHOC from "@/options/HOC/formHOC";
import Button from "@/options/components/common/button/button";
import Switcher from "@/options/components/common/switcher/switcher";
import { useCallback, useEffect } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { QueryParamAction } from "@models/formFieldModel";

const queryParamActionOptions = Object.entries(QueryParamAction).reduce((previous: any, [value, label]: any) => {
  previous.push({ value: value.toLowerCase(), label });
  return previous;
}, []);

const QueryParamForm = () => {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "queryParams",
  });

  const watchFieldArray = watch("queryParams");
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
    append({ key: "", value: "", action: QueryParamAction.ADD, enabled: true });
  }, []);

  useEffect(() => {
    handleAddCondition();
  }, []);

  return (
    <div className="mt-3">
      {controlledFields.map((item, index) => {
        const disabled = !controlledFields[index].enabled;
        return (
          <div key={item.id} className="flex items-center gap-3">
            <span className={`w-24 ${disabled ? "text-slate-500" : ""}`}>Operator&nbsp;</span>
            <div className="w-36">
              <Controller
                name={`queryParams.${index}.action`}
                control={control}
                render={({ field, fieldState }) => {
                  return (
                    <Select
                      classes="flex-[1]"
                      options={queryParamActionOptions}
                      error={fieldState.error?.message}
                      disabled={disabled}
                      {...field}
                    />
                  );
                }}
              />
            </div>

            <Controller
              name={`queryParams.${index}.key`}
              control={control}
              rules={{ required: { value: true, message: "Key Is Required" } }}
              render={({ field, fieldState }) => {
                return (
                  <Input
                    classes="flex-[3]"
                    disabled={disabled}
                    placeholder="key"
                    error={fieldState.error?.message}
                    {...field}
                  />
                );
              }}
            />
            <Controller
              name={`queryParams.${index}.value`}
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <Input
                    disabled={controlledFields[index].action === QueryParamAction.REMOVE || disabled}
                    hidden={controlledFields[index].action === QueryParamAction.REMOVE}
                    classes="flex-[3]"
                    placeholder="Value"
                    error={fieldState.error?.message}
                    {...field}
                  />
                );
              }}
            />
            {/* <Controller
              name={`queryParams.${index}.enabled`}
              control={control}
              render={({ field }) => {
                return <Switcher {...field} />;
              }}
            /> */}
            {controlledFields.length > 1 && (
              <Button variant="icon" className="cursor-pointer hover:text-red-400" onClick={() => handleRemove(index)}>
                <Icon name="cross" />
              </Button>
            )}
          </div>
        );
      })}
      <Button size="small" variant="outline" onClick={handleAddCondition} type="button">
        Add Query Param
      </Button>
    </div>
  );
};

export default FormHOC(QueryParamForm);
