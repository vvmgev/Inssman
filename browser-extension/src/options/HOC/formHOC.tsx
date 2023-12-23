import { Component } from "react";
import TrackService from "src/services/TrackService";
import Toast from "components/common/toast/toast";
import Forms from "../pages/forms/forms";
import config from "../formBuilder/config";
import { FormMode, IForm, IRule, IRuleMetaData } from "models/formFieldModel";
import { PostMessageAction } from "models/postMessageActionModel";
import { StorageItemType } from "src/models/storageModel";
import { toast } from "react-toastify";

export type FormError = {
  [key: string]: { message: string } | null;
};

type State = {
  error: FormError;
  mode: FormMode;
  id: null | number;
  ruleMetaData: IRuleMetaData;
  template: boolean;
  showToaster: boolean;
};

type Props = {
  params: {
    id: string;
  };
  location: {
    state: any;
    pathname: string;
  };
};

const FormHOC = () => {
  return class extends Component<Props, State> {
    fields: any;
    pageType: string;
    constructor(props) {
      super(props);
      const id = props.params.id ? Number(props.params.id) : null;
      const mode = id ? FormMode.UPDATE : FormMode.CREATE;
      const state = this.props.location.state;
      let ruleMetaData: IRuleMetaData = {} as IRuleMetaData;
      this.pageType = this.getPageType(mode);
      this.fields = config[this.pageType].fields;

      if (state?.template) {
        ruleMetaData = {
          pageType: this.pageType,
          ...state.ruleMetaData,
        };
      }
      this.state = {
        error: {},
        ruleMetaData,
        mode,
        id,
        template: state?.template,
        showToaster: state?.showToaster,
      };
    }

    getPageType = (mode: FormMode): string => {
      const pathArr = this.props.location.pathname.split("/");
      return mode === FormMode.CREATE ? pathArr[pathArr.length - 1] : pathArr[pathArr.length - 2];
    };

    setError = (fieldName, message) => {
      this.setState((state) => ({
        ...state,
        error: {
          ...state.error,
          [fieldName]: message,
        },
      }));
    };

    validate = (name, value, fieldValidations) => {
      const error = {};
      fieldValidations?.forEach((validation) => {
        if (error[name]) return;
        error[name] = this.inValid(value, validation.regexp) ? validation.message : null;
      });
      return error;
    };

    inValid = (value, regexp) => regexp.test(value);
    valid = (value, regexp) => !this.inValid(value, regexp);

    validateArray = (name, value, validations) => {
      let error = {};
      value.forEach((item, index) => {
        for (const validationKey in validations[name]) {
          const validation = validations[name][validationKey];
          error = {
            [name]: {
              ...error[name],
              [index]: {
                ...error[name]?.[index],
                ...this.validate(validationKey, item[validationKey], validation),
              },
            },
          };
        }
      });
      return error;
    };

    validateAll = (ruleMetaData) => {
      let error = {};
      this.fields.forEach((field) => {
        for (let name in field.validations) {
          const fieldValidations = field.validations[name];
          error = {
            ...error,
            ...(Array.isArray(ruleMetaData[name])
              ? this.validateArray(name, ruleMetaData[name], field.validations)
              : this.validate(name, ruleMetaData[name], fieldValidations)),
          };
        }
      });
      return error;
    };

    onChange = (event, field) => {
      const { name, value } = event.target;
      const { validations = {} } = field;
      const error = Array.isArray(value)
        ? this.validateArray(name, value, validations)
        : this.validate(name, value, validations[name]);

      this.setState((state) => ({
        ...state,
        error: {
          ...state.error,
          ...error,
        },
        ruleMetaData: {
          ...state.ruleMetaData,
          [name]: value,
        },
      }));
    };

    onDelete = (): void => {
      TrackService.trackEvent(`Rule Delete By ID Event`);
      const { id } = this.state;
      chrome.runtime.sendMessage(
        {
          action: PostMessageAction.DeleteRule,
          data: { id },
        },
        () => (this.props as any).navigate("/")
      );
    };

    formatter = (ruleMetaData) => {
      this.fields.forEach((field) => {
        for (let name in field.formatters) {
          const formatter = field.formatters[name];
          if (!field.multipleFields) {
            ruleMetaData[name] = formatter(ruleMetaData[name]);
          }
        }
      });
      return ruleMetaData;
    };

    hasErrors = (error): boolean => {
      let index = 0;
      const keys = Object.keys(error);
      const findError = (item): boolean => {
        if (typeof item === "object" && item) return this.hasErrors(error[keys[index]]);
        if (Boolean(item)) return true;
        if (typeof error[keys[++index]] !== "undefined") return findError(error[keys[index]]);
        return false;
      };
      return Boolean(findError(error[keys[index]]));
    };

    onSave = (rule: IRule) => {
      const { ruleMetaData, id } = this.state;
      const cloneRuleMetaData = this.formatter(structuredClone(ruleMetaData));
      const error = this.validateAll(cloneRuleMetaData);
      const hasErrors = this.hasErrors(error);
      if (hasErrors) {
        this.setState({ error });
        return;
      }

      const form: IForm = {
        rule,
        ruleMetaData: {
          ...cloneRuleMetaData,
          enabled: typeof ruleMetaData.enabled !== "undefined" ? ruleMetaData.enabled : true,
          type: StorageItemType.RULE,
          lastMatchedTimestamp: ruleMetaData.lastMatchedTimestamp || null,
        },
      };
      if (form.rule) {
        // TODO need make it dynamic from UI
        form.rule.condition.isUrlFilterCaseSensitive = false;
        // requestMethods can be undefined when a rule create from "Inject file" or "Modify Request Body" pages
        form.rule.condition.requestMethods =
          ruleMetaData.requestMethods?.length > 0 ? ruleMetaData.requestMethods : undefined;
        if (id) {
          form.rule.id = id;
        }
      }

      chrome.runtime.sendMessage(
        {
          action: this.state.mode === FormMode.CREATE ? PostMessageAction.AddRule : PostMessageAction.UpdateRule,
          data: form,
        },
        (data) => {
          if (data?.error) {
            this.setError(data.info.fieldName, data.info.message);
            return;
          }
          if (this.state.mode === FormMode.CREATE) {
            (this.props as any).navigate(`/edit/${data.pageType}/${data.id}`, {
              state: { showToaster: true },
            });
          }

          if (this.state.mode === FormMode.UPDATE) {
            this.showToaster();
          }
        }
      );
    };

    render() {
      const { mode, ruleMetaData, error } = this.state;
      if (mode === FormMode.UPDATE && !Object.keys(ruleMetaData).length) {
        return <></>;
      }

      return (
        <Forms
          ruleMetaData={ruleMetaData}
          onChange={this.onChange}
          error={error}
          onDelete={this.onDelete}
          onSave={this.onSave}
          mode={mode}
          pageType={this.getPageType(mode)}
          template={this.state.template}
        />
      );
    }

    getDefaultData() {
      let defaultValues: { [key: string]: string | string[] } = {
        pageType: this.pageType,
      };
      this.fields.forEach((field) => {
        if (field.multipleFields) {
          defaultValues = {
            ...defaultValues,
            ...structuredClone(field.defaultValues),
          };
          return;
        }
        defaultValues[field.name] = field.defaultValue;
      });
      return defaultValues;
    }

    showToaster(): void {
      toast(<Toast />);
    }

    componentDidMount(): void {
      const search = (this.props as any).location.search;
      const urlSearchParams = new URLSearchParams(search);
      const { mode, template } = this.state;
      if (mode === FormMode.CREATE && !template) {
        const defaultValues = this.getDefaultData();
        this.setState((state) => ({
          ...state,
          ruleMetaData: {
            ...state.ruleMetaData,
            ...defaultValues,
            source: urlSearchParams.get("source") || (defaultValues.source as string),
            name: urlSearchParams.get("name") || (defaultValues.name as string),
          },
        }));
        return;
      }
      if (mode === FormMode.UPDATE) {
        if (this.state.showToaster) {
          this.showToaster();
        }
        chrome.runtime.sendMessage(
          {
            action: PostMessageAction.GetRuleById,
            data: { id: this.state.id },
          },
          ({ ruleMetaData }) => this.setState({ ruleMetaData, showToaster: false })
        );
        return;
      }
    }

    componentDidUpdate(prevProps: Readonly<{}>): void {
      const state = (this.props as any).location.state;
      const prevState = (prevProps as any).location.state;
      if (state?.template && state.ruleMetaData.id !== prevState.ruleMetaData.id) {
        this.setState({ ruleMetaData: state.ruleMetaData });
      }
    }
  };
};

export default FormHOC;
