import { PropsWithChildren } from "react";
import { FormMode, IRule, IRuleMetaData } from "src/models/formFieldModel";
import ColorCover from "src/options/components/common/colorCover/colorCover";
import Form from "src/options/components/common/form/form";
import FormBuilder from "src/options/formBuilder/formBuilder";
import config from "src/options/formBuilder/config";
import { FormError } from "src/options/HOC/formHOC";

type Props = PropsWithChildren<{
  onDelete: Function;
  onSave: Function;
  onChange: Function;
  template: boolean;
  mode: FormMode;
  pageType: string;
  error: FormError;
  ruleMetaData: IRuleMetaData;
}>;

const Forms = ({ children, ...props }: Props) => {
  const { onDelete, onSave, mode, error, pageType, ruleMetaData, onChange } =
    props;
  const { generateRule } = config[pageType];

  const onSubmit = () => {
    const form: IRule = generateRule(ruleMetaData);
    onSave(form);
  };

  return (
    <ColorCover classes="mx-[5%] p-5">
      <Form
        onDelete={onDelete}
        onSubmit={onSubmit}
        mode={mode}
        error={error}
        pageType={pageType}
      >
        <FormBuilder
          ruleMetaData={ruleMetaData}
          onChange={onChange}
          error={error}
          mode={mode}
          pageType={pageType}
        />
      </Form>
    </ColorCover>
  );
};

export default Forms;
