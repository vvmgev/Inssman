import FormHOC from "@/options/HOC/formHOC";
import Input from "@/options/components/common/input/input";
import { Controller, useFormContext } from "react-hook-form";

const QueryParamForm = () => {
  const methods = useFormContext();
  return (
    <div className="flex items-center mt-3">
      <div className="min-w-[100px]">Redirect to</div>
      <div className="w-3/5">
        <Controller
          name="destination"
          control={methods.control}
          rules={{
            required: { value: true, message: "Destination Is Required" },
            validate: {
              emptySpace: (value) => {
                return /\b\s+\b/.test(value) ? "Destination Cannot Contain Space" : undefined;
              },
            },
          }}
          render={({ field, fieldState }) => {
            return <Input placeholder="e.g youtube.com" error={fieldState.error?.message} {...field} />;
          }}
        />
      </div>
    </div>
  );
};

export default FormHOC(QueryParamForm);
