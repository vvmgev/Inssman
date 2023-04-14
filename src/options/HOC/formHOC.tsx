import React from 'react';
import { FormMode, IForm, IRule, MatchType, MatchTypeMap, ValidateFields } from 'models/formFieldModel';
import { PostMessageAction } from 'models/postMessageActionModel';
import { capitalizeFirstLetter, makeExactMatch } from 'options/utils';
import ResourceType = chrome.declarativeNetRequest.ResourceType;
import TrackService from 'src/services/TrackService';

type FormError = {
  [key: string]: { message: string };
}

type State = {
  error: FormError,
  mode: FormMode,
  id: null | number,
  ruleData: any,
};

const FormHOC = (Component: any) => {
  return class extends React.Component<{}, State> {
    constructor(props) {
      super(props);
      const id = props.params.id ? Number(props.params.id) : null;
      const mode = id ? FormMode.UPDATE : FormMode.CREATE;
      this.state = {
        error: {},
        ruleData: {},
        mode,
        id,
      }
    }

    setRuleData = ruleData => {
      this.setState({
        ...this.state,
        ruleData: {
          ...this.state.ruleData,
          ...ruleData,
        },
      });
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

    onChange = (event) => {
      this.setState(state => ({
        ...state,
        ruleData: {
          ...state.ruleData,
          [event.target.name]: event.target.value
        }
      }))
      if(ValidateFields.includes(event.target.name)) {
        this.validate(event.target.name, event.target.value);
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
          ruleData
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
      const { mode, ruleData } = this.state;
      if(mode === FormMode.UPDATE && !Object.keys(ruleData).length) {
        return <></>
      }
      
      return <Component
        setRuleData={this.setRuleData}
        ruleData={this.state.ruleData}
        setError={this.setError}
        onChange={this.onChange}
        onSave={this.onSave}
        onDelete={this.onDelete}
        error={this.state.error}
        mode={this.state.mode} />
    }

    componentDidMount(): void {
      if(this.state.mode === FormMode.UPDATE) {
        chrome.runtime.sendMessage({
          action: PostMessageAction.GetRuleById,
          data: {id: this.state.id},
        }, ({ruleData}) => this.setState({ruleData}));
      }
    }
  }
}

export default FormHOC;