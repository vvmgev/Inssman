import React from 'react';
import TrackService from 'src/services/TrackService';
import { FormMode, IForm, IRule, IRuleData, MatchType, MatchTypeMap } from 'models/formFieldModel';
import { PostMessageAction } from 'models/postMessageActionModel';
import { makeExactMatch } from 'options/utils';
import { StorageItemType } from 'src/models/storageModel';
import Forms from '../pages/forms/forms';
import config from '../formBuilder/config';
import ResourceType = chrome.declarativeNetRequest.ResourceType;

type FormError = {
  [key: string]: { message: string } | null;
}

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
    constructor(props) {
      super(props);
      const id = props.params.id ? Number(props.params.id) : null;
      const mode = id ? FormMode.UPDATE : FormMode.CREATE;
      const state = (this.props as any).location.state; 
      let ruleData: IRuleData = {} as IRuleData;
      const pageType = this.getPageType(mode);
      this.fields = config[pageType].fields;
      if(state?.template) {
        ruleData = {
          pageType,
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

    setRuleData = (ruleData) => {
      this.setState(state => ({
        ...state,
        ruleData: {
          ...state.ruleData,
          ...ruleData,
        },
      }))
    };

    setError = (fieldName, message) => {
      this.setState(state => ({
        ...state,
        error: {
          ...state.error,
          [fieldName]: {
            message,
          }
        }
      }))
    }

    validate = (name, value, fieldValidations) => {
      const error = {};
      fieldValidations?.forEach(validation => {
        if(error[name]) return;
        error[name] = this.inValid(value, validation.regexp) ? validation.message : null;
      });
      return error;
    };
    
    inValid = (value, regexp) => regexp.test(value);
    valid = (value, regexp) => !this.inValid(value, regexp);

    validateAll = () => {
      let error = {};
      this.fields.forEach(field => {
        if(field.multipleFields) {
          for(let name in field.validations) {
            const fieldValidations = field.validations[name];
            error = {
              ...error,
              ...this.validate(name, this.state.ruleData[name], fieldValidations)
            }  
          }
        } else {
          error = {
            ...error,
            ...this.validate(field.name, this.state.ruleData[field.name], field.validations)
          }
        }
      })
      return error;
    };

    onChange = (event, field) => {
      const { name, value } = event.target;
      const { validations = {}, multipleFields } = field;
      const fieldValidations = multipleFields ? validations[name] : validations;
      const error = this.validate(name, value, fieldValidations);
      
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
    
    onSave = (rule: IRule) => {
      const { ruleData, id } = this.state;
      const error = this.validateAll();
      if((Object.values(error)).filter(Boolean).length) {
        this.setState({error});
        return;
      }

      const form: IForm = {
          rule,
          ruleData: {
            ...ruleData,
            enabled: typeof ruleData.enabled !== 'undefined' ? ruleData.enabled : true,
            type: StorageItemType.RULE
          }
      }
      if(form.rule) {
        // TODO need make it dynamic from UI
        form.rule.condition.isUrlFilterCaseSensitive = false;
        // TODO need make it dynamic from UI
        if (!(form.rule.condition as any).resourceTypes || !(form.rule.condition as any).resourceTypes.length) {
          (form.rule.condition as any).resourceTypes = [
            ResourceType.MAIN_FRAME,
            ResourceType.SUB_FRAME,
            ResourceType.XMLHTTPREQUEST,
            ResourceType.CSP_REPORT,
            ResourceType.FONT,
            ResourceType.IMAGE,
            ResourceType.MEDIA,
            ResourceType.OBJECT,
            ResourceType.PING,
            ResourceType.SCRIPT,
            ResourceType.STYLESHEET,
            ResourceType.WEBSOCKET,
            ResourceType.OTHER,
          ]
        }
        // requestMethods can be undefined when a rule create from "Inject file" or "Modify Request Body" pages
        form.rule.condition.requestMethods = ruleData.requestMethods?.length > 0 ? ruleData.requestMethods : undefined;
        if (id) {
          form.rule.id = id;
        }
        if (ruleData.matchType === MatchType.EQUAL) {
          form.rule.condition[MatchTypeMap[ruleData.matchType]] = makeExactMatch(ruleData.source);
        }
        // if (ruleData.matchType === MatchType.WILDCARD) {
        //   form.rule.condition[MatchTypeMap[ruleData.matchType]] = replaceAsterisk(ruleData.source);
        // }
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

      // @ts-ignore
      return <Forms
                ruleData={ruleData}
                onChange={this.onChange}
                error={error}
                onDelete={this.onDelete}
                onSave={this.onSave}
                mode={mode}
                pageType={this.getPageType(mode)}
                setRuleData={this.setRuleData}
                template={this.state.template}
              />
    }

    componentDidMount(): void {
      if(this.state.mode === FormMode.UPDATE) {
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