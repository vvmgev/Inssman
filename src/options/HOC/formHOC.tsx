import React from 'react';
import TrackService from 'src/services/TrackService';
import { FormMode, IForm, IRule, IRuleData, MatchType, MatchTypeMap, ValidateFields } from 'models/formFieldModel';
import { PostMessageAction } from 'models/postMessageActionModel';
import { capitalizeFirstLetter, makeExactMatch } from 'options/utils';
import { StorageItemType } from 'src/models/storageModel';
import Forms from '../pages/forms/forms';
import ResourceType = chrome.declarativeNetRequest.ResourceType;

type FormError = {
  [key: string]: { message: string };
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
    constructor(props) {
      super(props);
      const id = props.params.id ? Number(props.params.id) : null;
      const mode = id ? FormMode.UPDATE : FormMode.CREATE;
      const state = (this.props as any).location.state; 
      let ruleData: IRuleData = {} as IRuleData;
      const pageType = this.getPageType(mode);
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

    validate = (name, value) => {
      let hasError = !value;
      this.setState(state => ({
        ...state,
        error: {
          ...state.error,
          [name]: (hasError ? {message: `${capitalizeFirstLetter(name)} is required`} : null)
        }
      }))
      return hasError;
    }

    validateAll = () => {
      let hasError = false;
      const { ruleData } = this.state;
      ValidateFields.forEach(field => {
        if(field in ruleData) {
          const fieldHasError = this.validate(field, ruleData[field]);
          if(fieldHasError && !hasError) {
            hasError = true;
          }
        }
      })
      return hasError;
    }

    onChange = event => {
      const { name, value } = event.target;
      this.setState(state => ({
        ...state,
        ruleData: {
          ...state.ruleData,
          [name]: value,
        }
      }))
      if(ValidateFields.includes(name)) {
        this.validate(name, value);
      }
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
      if(this.validateAll()) {
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