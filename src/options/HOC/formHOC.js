import TrackService from 'src/services/TrackService';
import Toast from 'components/common/toast/toast';
import { Component } from 'react';
import { FormMode } from 'models/formFieldModel';
import { PostMessageAction } from 'models/postMessageActionModel';
import { StorageItemType } from 'src/models/storageModel';
import { toast } from 'react-toastify';
import config from '../formBuilder/config';
import Forms from '../pages/forms/forms';

const FormHOC = () => class HOC extends Component {
  fields;

  pageType;

  constructor(props) {
    super(props);
    const id = props.params.id ? Number(props.params.id) : null;
    const mode = id ? FormMode.UPDATE : FormMode.CREATE;
    const { state } = this.props.location;
    let ruleMetaData = {};
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

  getPageType = (mode) => {
    const pathArr = this.props.location.pathname.split('/');
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
      for (const name in field.validations) {
        const fieldValidations = field.validations[name];
        error = {
          ...error,
          ...(Array.isArray(ruleMetaData[name]) ? this.validateArray(name, ruleMetaData[name], field.validations) : this.validate(name, ruleMetaData[name], fieldValidations)),
        };
      }
    });
    return error;
  };

  onChange = (event, field) => {
    const { name, value } = event.target;
    const { validations = {} } = field;
    const error = Array.isArray(value) ? this.validateArray(name, value, validations) : this.validate(name, value, validations[name]);

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

  onDelete = () => {
    TrackService.trackEvent('Rule Delete By ID Event');
    const { id } = this.state;
    chrome.runtime.sendMessage(
      { action: PostMessageAction.DeleteRule, data: { id } },
      () => this.props.navigate('/'),
    );
  };

  formatter = (ruleMetaData) => {
    this.fields.forEach((field) => {
      for (const name in field.formatters) {
        const formatter = field.formatters[name];
        if (!field.multipleFields) {
          ruleMetaData[name] = formatter(ruleMetaData[name]);
        }
      }
    });
    return ruleMetaData;
  };

  hasErrors = (error) => {
    let index = 0;
    const keys = Object.keys(error);
    const findError = (item) => {
      if (typeof item === 'object' && item) return this.hasErrors(error[keys[index]]);
      if (item) return true;
      if (typeof error[keys[++index]] !== 'undefined') return findError(error[keys[index]]);
      return false;
    };
    return Boolean(findError(error[keys[index]]));
  };

  onSave = (rule) => {
    const { ruleMetaData, id } = this.state;
    const cloneRuleMetaData = this.formatter(structuredClone(ruleMetaData));
    const error = this.validateAll(cloneRuleMetaData);
    const hasErrors = this.hasErrors(error);
    if (hasErrors) {
      this.setState({ error });
      return;
    }

    const form = {
      rule,
      ruleMetaData: {
        ...cloneRuleMetaData,
        enabled: typeof ruleMetaData.enabled !== 'undefined' ? ruleMetaData.enabled : true,
        type: StorageItemType.RULE,
        lastMatchedTimestamp: ruleMetaData.lastMatchedTimestamp || null,
      },
    };
    if (form.rule) {
      // TODO need make it dynamic from UI
      form.rule.condition.isUrlFilterCaseSensitive = false;
      // requestMethods can be undefined when a rule create from "Inject file" or "Modify Request Body" pages
      form.rule.condition.requestMethods = ruleMetaData.requestMethods?.length > 0 ? ruleMetaData.requestMethods : undefined;
      if (id) {
        form.rule.id = id;
      }
    }

    chrome.runtime.sendMessage({
      action: this.state.mode === FormMode.CREATE ? PostMessageAction.AddRule : PostMessageAction.UpdateRule,
      data: form,
    }, (data) => {
      if (data?.error) {
        this.setError(data.info.fieldName, data.info.message);
        return;
      }
      if (this.state.mode === FormMode.CREATE) {
        this.props.navigate(`/edit/${data.pageType}/${data.id}`, { state: { showToaster: true } });
      }

      if (this.state.mode === FormMode.UPDATE) {
        this.showToaster();
      }
    });
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
    let defaultValues = { pageType: this.pageType };
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

  showToaster() {
    toast(<Toast />);
  }

  componentDidMount() {
    const { search } = this.props.location;
    const urlSearchParams = new URLSearchParams(search);
    const { mode, template } = this.state;
    if (mode === FormMode.CREATE && !template) {
      const defaultValues = this.getDefaultData();
      this.setState((state) => ({
        ...state,
        ruleMetaData: {
          ...state.ruleMetaData,
          ...defaultValues,
          source: urlSearchParams.get('source') || defaultValues.source,
          name: urlSearchParams.get('name') || defaultValues.name,
        },
      }));
      return;
    }
    if (mode === FormMode.UPDATE) {
      if (this.state.showToaster) {
        this.showToaster();
      }
      chrome.runtime.sendMessage({
        action: PostMessageAction.GetRule,
        data: { id: this.state.id },
      }, ({ ruleMetaData }) => this.setState({ ruleMetaData, showToaster: false }));
    }
  }

  componentDidUpdate(prevProps) {
    const { state } = this.props.location;
    const prevState = prevProps.location.state;
    if (state?.template && state.ruleMetaData.id !== prevState.ruleMetaData.id) {
      this.setState({ ruleMetaData: state.ruleMetaData });
    }
  }
};

export default FormHOC;
