import React from 'react';
import { FormMode, IForm, MatchType, MatchTypeMap, ValidateFields } from 'models/formFieldModel';
import { PostMessageAction } from 'models/postMessageActionModel';
import { capitalizeFirstLetter, makeExactMatch, replaceAsterisk } from 'options/utils';
import ResourceType = chrome.declarativeNetRequest.ResourceType;

type FormError = {
  [key: string]: { message: string };
}

type State = {
  error: FormError,
  mode: FormMode,
  id: null | number,
  ruleData: any
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
        ruleData,
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

    onSave = (form: IForm) => {
      const { id } = this.state;
      const { ruleData } = this.state;
      if(this.validateAll()) {
        return;
      }
      form.data.ruleData = ruleData;
      form.action = this.state.mode === FormMode.CREATE ? PostMessageAction.AddRule : PostMessageAction.UpdateRule;
      // TODO need make it dynamic from UI
      form.data.rule.condition.isUrlFilterCaseSensitive = false;
      if (!(form.data.rule.condition as any).resourceTypes || !(form.data.rule.condition as any).resourceTypes.length) {
        (form.data.rule.condition as any).resourceTypes = [
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
        form.data.rule.id = id;
      }
      if (ruleData.matchType === MatchType.EQUAL) {
        form.data.rule.condition[MatchTypeMap[ruleData.matchType]] = makeExactMatch(ruleData.source);
      }
      if (ruleData.matchType === MatchType.WILDCARD) {
        form.data.rule.condition[MatchTypeMap[ruleData.matchType]] = replaceAsterisk(ruleData.source);
      }
      chrome.runtime.sendMessage(form, (data) => {
        if(data?.error) {
          this.setError(data.info.fieldName, data.info.message)
          return;
        }
        (this.props as any).navigate('/')
      });
    }

    render() {
      return <Component
        setRuleData={this.setRuleData}
        ruleData={this.state.ruleData}
        setError={this.setError}
        onChange={this.onChange}
        onSave={this.onSave}
        error={this.state.error}
        mode={this.state.mode} />
    }

    componentDidMount(): void {
      if(this.state.mode === FormMode.UPDATE) {
        chrome.runtime.sendMessage({
          action: PostMessageAction.GetRuleById,
          id: this.state.id,
        }, ({ruleData}) => this.setState({ruleData}));
      }
    }
  }
}

export default FormHOC;