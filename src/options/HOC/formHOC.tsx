import React from 'react';
import TrackService from 'src/services/TrackService';
import { FormMode, IForm, IRule, IRuleData, MatchType, MatchTypeMap, PageType } from 'models/formFieldModel';
import { PostMessageAction } from 'models/postMessageActionModel';
import { makeExactMatch, replaceAsterisk, replaceVariable } from 'options/utils';
import { StorageItemType } from 'src/models/storageModel';
import Forms from '../pages/forms/forms';
import config from '../formBuilder/config';
import ResourceType = chrome.declarativeNetRequest.ResourceType;
import Redirect = chrome.declarativeNetRequest.Redirect;

export type FormError = {
  [key: string]: { message: string } | null;
};

type State = {
  error: FormError,
  mode: FormMode,
  id: null | number,
  ruleData: IRuleData,
  template: boolean,
};

const FormHOC = () => {
  return class extends React.Component<{}, State> {
    fields: any;
    pageType: string;
    constructor(props) {
      super(props);
      const id = props.params.id ? Number(props.params.id) : null;
      const mode = id ? FormMode.UPDATE : FormMode.CREATE;
      const state = (this.props as any).location.state; 
      let ruleData: IRuleData = {} as IRuleData;
      this.pageType = this.getPageType(mode);
      this.fields = config[this.pageType].fields;

      if(state?.template) {
        ruleData = {
          pageType: this.pageType,
          ...state.ruleData,
        }
      }
      this.state = {
        error: {},
        ruleData,
        mode,
        id,
        template: state?.template
      }
    }

    getPageType = (mode: FormMode): string => {
      const pathArr = (this.props as any).location.pathname.split('/');
      return mode === FormMode.CREATE ? pathArr[pathArr.length - 1] : pathArr[pathArr.length - 2];
    };

    setError = (fieldName, message) => {
      this.setState(state => ({
        ...state,
        error: {
          ...state.error,
          [fieldName]: message
        }
      }))
    }

    validate = (name, value, fieldValidations,) => {
      const error = {};
      fieldValidations?.forEach(validation => {
        if(error[name]) return;
        error[name] = this.inValid(value, validation.regexp) ? validation.message : null;
      });
      return error;
    };

    inValid = (value, regexp) => regexp.test(value);
    valid = (value, regexp) => !this.inValid(value, regexp);

    validateArray = (name, value, validations) => {
      let error = {};
      value.forEach((item, index) => {
        for(const validationKey in validations[name]) {
          const validation = validations[name][validationKey];
          error = {
            [name]: {
              ...error[name],
              [index]: {
                ...error[name]?.[index],
                ...this.validate(validationKey, item[validationKey], validation),
              }
            }
          }
        }
      });
      return error;
    }
    
    validateAll = (ruleData) => {
      let error = {};
      this.fields.forEach(field => {
        for(let name in field.validations) {
          const fieldValidations = field.validations[name];
          error = {
            ...error,
            ...(Array.isArray(ruleData[name]) ? this.validateArray(name, ruleData[name], field.validations) : this.validate(name, ruleData[name], fieldValidations))
          }
        }
      })
      return error;
    };

    onChange = (event, field) => {
      const { name, value } = event.target;
      const { validations = {} } = field;
      const error = Array.isArray(value) ? this.validateArray(name, value, validations) : this.validate(name, value, validations[name]);
      
      this.setState(state => ({
        ...state,
        error: {
          ...state.error,
          ...error,
        },
        ruleData: {
          ...state.ruleData,
          [name]: value
        }
      }))
    }

    onDelete = (): void => {
      TrackService.trackEvent(`Rule Delete By ID Event`);
      const { id } = this.state;
      chrome.runtime.sendMessage({
          action: PostMessageAction.DeleteRuleById, data: { id } }, 
          () => (this.props as any).navigate('/')
      );
    };

    formatter = (ruleData) => {
      this.fields.forEach(field => {
        for(let name in field.formatters) {
          const formatter = field.formatters[name];
          if(!field.multipleFields){
            ruleData[name] = formatter(ruleData[name]);
          }
        }
      })
      return ruleData;
    }

    hasErrors = (error): boolean => {
      let index = 0;
      const keys = Object.keys(error)
      const findError = (item): boolean => {
        if(typeof item === 'object' && item) return this.hasErrors(error[keys[index]]);
        if(Boolean(item)) return true;
        if(typeof error[keys[++index]] !== 'undefined') return findError(error[keys[index]]);
        return false;
      }
      return Boolean(findError(error[keys[index]]));
    };
    
    onSave = (rule: IRule) => {
      const { ruleData, id } = this.state;
      const cloneRuleData = this.formatter(structuredClone(ruleData));
      const error = this.validateAll(cloneRuleData);
      const hasErrors = this.hasErrors(error);
      if(hasErrors) {
        this.setState({error});
        return;
      }

      const form: IForm = {
          rule,
          ruleData: {
            ...cloneRuleData,
            enabled: typeof ruleData.enabled !== 'undefined' ? ruleData.enabled : true,
            type: StorageItemType.RULE
          }
      }
      if(form.rule) {
        // TODO need make it dynamic from UI
        form.rule.condition.isUrlFilterCaseSensitive = false;
        const resourceTypes = form.rule.condition.resourceTypes;
        form.rule.condition.resourceTypes = resourceTypes.length ? resourceTypes : Object.values(ResourceType);
        // requestMethods can be undefined when a rule create from "Inject file" or "Modify Request Body" pages
        form.rule.condition.requestMethods = ruleData.requestMethods?.length > 0 ? ruleData.requestMethods : undefined;
        if (id) {
          form.rule.id = id;
        }
        if (ruleData.matchType === MatchType.EQUAL) {
          form.rule.condition[MatchTypeMap[ruleData.matchType]] = makeExactMatch(ruleData.source);
        }
        if (ruleData.matchType === MatchType.WILDCARD) {
          form.rule.condition[MatchTypeMap[ruleData.matchType]] = replaceAsterisk(ruleData.source);
          if(this.pageType === PageType.REDIRECT) {
            (form.rule.action.redirect as Redirect).regexSubstitution = replaceVariable(ruleData.destination as string);
          }
        }
      }
      
      chrome.runtime.sendMessage({
        action: this.state.mode === FormMode.CREATE ? PostMessageAction.AddRule : PostMessageAction.UpdateRule,
        data: form
      }, (data) => {
        if(data?.error) {
          this.setError(data.info.fieldName, data.info.message)
          return;
        }
        (this.props as any).navigate('/')
      });
    }

    render() {
      const { mode, ruleData, error } = this.state;
      if(mode === FormMode.UPDATE && !Object.keys(ruleData).length) {
        return <></>
      }

      return <Forms
                ruleData={ruleData}
                onChange={this.onChange}
                error={error}
                onDelete={this.onDelete}
                onSave={this.onSave}
                mode={mode}
                pageType={this.getPageType(mode)}
                template={this.state.template}
              />
    }

    getDefaultData() {
      let defaultValues: {[key: string]: string | string[]} = { pageType: this.pageType };
      this.fields.forEach(field => {
          if(field.multipleFields) {
              defaultValues = {
                  ...defaultValues,
                  ...structuredClone(field.defaultValues)
              }
              return
          }
          defaultValues[field.name] = field.defaultValue;
      });
      return defaultValues;
    }

    componentDidMount(): void {
      const search = (this.props as any).location.search;
      const urlSearchParams = new URLSearchParams(search);
      const { mode, template } = this.state;
      if(mode === FormMode.CREATE && !template) {
        const defaultValues = this.getDefaultData();
        this.setState(state => ({
          ...state,
          ruleData: {
            ...state.ruleData,
            ...defaultValues,
            source: urlSearchParams.get('source') || defaultValues.source as string,
          },
        }));
        return;
      }
      if(mode === FormMode.UPDATE) {
        chrome.runtime.sendMessage({
          action: PostMessageAction.GetRuleById,
          data: {id: this.state.id},
        }, ({ruleData}) => this.setState({ruleData}));
        return;
      }
    }

    componentDidUpdate(prevProps: Readonly<{}>): void {
      const state = (this.props as any).location.state;
      const prevState = (prevProps as any).location.state;
      if(state?.template  && state.ruleData.id !== prevState.ruleData.id) {
        this.setState({ruleData: state.ruleData});
      }
    }
  }
}

export default FormHOC;