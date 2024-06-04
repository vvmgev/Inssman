import FormHOC from "@/options/HOC/formHOC";
import Editor from "@/options/components/common/editor/editor";

const ModifyRequestBody = () => {
  return (
    <div className="flex w-full mt-5">
      <Editor />
    </div>
  );
};

export default FormHOC(ModifyRequestBody);
