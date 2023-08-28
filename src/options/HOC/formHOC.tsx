import React from 'react';
import TrackService from 'src/services/TrackService';
import { FormMode, IForm, IRule, MatchType, MatchTypeMap, PageType, IRuleMetaData } from 'models/formFieldModel';
import { PostMessageAction } from 'models/postMessageActionModel';
import { makeExactMatch, replaceAsterisk, replaceVariable } from 'options/utils';
import { StorageItemType } from 'src/models/storageModel';
import Forms from '../pages/forms/forms';
import config from '../formBuilder/config';
import Redirect = chrome.declarativeNetRequest.Redirect;

export type FormError = {
  [key: string]: { message: string } | null;
};

type State = {
  error: FormError,
  mode: FormMode,
  id: null | number,
  ruleMetaData: IRuleMetaData,
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
      let ruleMetaData: IRuleMetaData = {} as IRuleMetaData;
      this.pageType = this.getPageType(mode);
      this.fields = config[this.pageType].fields;

      if(state?.template) {
        ruleMetaData = {
          pageType: this.pageType,
          ...state.ruleMetaData,
        }
      }
      this.state = {
        error: {},
        ruleMetaData,
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
    
    validateAll = (ruleMetaData) => {
      let error = {};
      this.fields.forEach(field => {
        for(let name in field.validations) {
          const fieldValidations = field.validations[name];
          error = {
            ...error,
            ...(Array.isArray(ruleMetaData[name]) ? this.validateArray(name, ruleMetaData[name], field.validations) : this.validate(name, ruleMetaData[name], fieldValidations))
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
        ruleMetaData: {
          ...state.ruleMetaData,
          [name]: value
        }
      }))
    }

    onDelete = (): void => {
      TrackService.trackEvent(`Rule Delete By ID Event`);
      const { id } = this.state;
      chrome.runtime.sendMessage({
          action: PostMessageAction.DeleteRule, data: { id } }, 
          () => (this.props as any).navigate('/')
      );
    };

    formatter = (ruleMetaData) => {
      this.fields.forEach(field => {
        for(let name in field.formatters) {
          const formatter = field.formatters[name];
          if(!field.multipleFields){
            ruleMetaData[name] = formatter(ruleMetaData[name]);
          }
        }
      })
      return ruleMetaData;
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
      const { ruleMetaData, id } = this.state;
      const cloneRuleMetaData = this.formatter(structuredClone(ruleMetaData));
      const error = this.validateAll(cloneRuleMetaData);
      const hasErrors = this.hasErrors(error);
      if(hasErrors) {
        this.setState({error});
        return;
      }

      const form: IForm = {
          rule,
          ruleMetaData: {
            ...cloneRuleMetaData,
            enabled: typeof ruleMetaData.enabled !== 'undefined' ? ruleMetaData.enabled : true,
            type: StorageItemType.RULE,
            lastMatchedTimestamp: ruleMetaData.lastMatchedTimestamp || null,
          }
      }
      if(form.rule) {
        // TODO need make it dynamic from UI
        form.rule.condition.isUrlFilterCaseSensitive = false;
        // requestMethods can be undefined when a rule create from "Inject file" or "Modify Request Body" pages
        form.rule.condition.requestMethods = ruleMetaData.requestMethods?.length > 0 ? ruleMetaData.requestMethods : undefined;
        if (id) {
          form.rule.id = id;
        }
        if (ruleMetaData.matchType === MatchType.EQUAL) {
          form.rule.condition[MatchTypeMap[ruleMetaData.matchType]] = makeExactMatch(ruleMetaData.source);
        }
        if (ruleMetaData.matchType === MatchType.WILDCARD) {
          form.rule.condition[MatchTypeMap[ruleMetaData.matchType]] = replaceAsterisk(ruleMetaData.source);
          if(this.pageType === PageType.REDIRECT) {
            (form.rule.action.redirect as Redirect).regexSubstitution = replaceVariable(ruleMetaData.destination as string);
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
      const { mode, ruleMetaData, error } = this.state;
      if(mode === FormMode.UPDATE && !Object.keys(ruleMetaData).length) {
        return <></>
      }

      return <Forms
                ruleMetaData={ruleMetaData}
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
          ruleMetaData: {
            ...state.ruleMetaData,
            ...defaultValues,
            source: urlSearchParams.get('source') || defaultValues.source as string,
          },
        }));
        return;
      }
      if(mode === FormMode.UPDATE) {
        chrome.runtime.sendMessage({
          action: PostMessageAction.GetRule,
          data: {id: this.state.id},
        }, ({ruleMetaData}) => this.setState({ruleMetaData}));
        return;
      }
    }

    componentDidUpdate(prevProps: Readonly<{}>): void {
      const state = (this.props as any).location.state;
      const prevState = (prevProps as any).location.state;
      if(state?.template  && state.ruleMetaData.id !== prevState.ruleMetaData.id) {
        this.setState({ruleMetaData: state.ruleMetaData});
      }
    }
  }
}

export default FormHOC;