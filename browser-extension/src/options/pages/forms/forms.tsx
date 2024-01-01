import { PropsWithChildren } from "react";
import { FormMode, IRule, IRuleMetaData } from "@models/formFieldModel";
import Section from "@options/components/common/section/section";
import Form from "@options/components/common/form/form";
import FormBuilder from "@options/formBuilder/formBuilder";
import config from "@options/formBuilder/config";
import { FormError } from "@options/HOC/formHOC";

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
  const { onDelete, onSave, mode, error, pageType, ruleMetaData, onChange } = props;
  const { generateRule } = config[pageType];

  const onSubmit = () => {
    const form: IRule = generateRule(ruleMetaData);
    onSave(form);
  };

  return (
    <Section classes="mx-[5%] p-5">
      <Form onDelete={onDelete} onSubmit={onSubmit} mode={mode} error={error} pageType={pageType}>
        <FormBuilder ruleMetaData={ruleMetaData} onChange={onChange} error={error} mode={mode} pageType={pageType} />
      </Form>
    </Section>
  );
};

export default Forms;
