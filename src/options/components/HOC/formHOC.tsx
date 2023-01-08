import React from 'react';
import { FormMode, IForm, MatchType, MatchTypeMap } from 'models/formFieldModel';
import { PostMessageAction } from 'models/postMessageActionModel';
import { makeExactMatch, replaceAsterisk } from 'options/utils';
import ResourceType = chrome.declarativeNetRequest.ResourceType;

type FormError = {
  [key: string]: { message: string };
}

type State = {
  error: FormError | null,
  mode: FormMode,
  id: null | number,
};

const FormHOC = (Component: any) => {
  return class extends React.Component<{}, State> {
    constructor(props) {
      super(props);
      const id = props.params.id ? Number(props.params.id) : null;
      const mode = id ? FormMode.UPDATE : FormMode.CREATE;
      this.state = {
        error: null,
        mode,
        id,
      }
    }

    validate = (name, value) => {
      let hasError = !value;
      this.setState({
        error: {
          ...this.state.error,
          [name]: (hasError ? {message: `${name} is required`} : null)
        }
      });
      return hasError;
    }

    onChange = (event) => {
      this.validate(event.target.name, event.target.value);
    }

    onSave = (form: IForm) => {
      const { id } = this.state;
      const { data: { ruleData }} = form;
      if((typeof ruleData.name === 'string' && this.validate('name', ruleData.name)) ||
         (typeof ruleData.source === 'string' && this.validate('source', ruleData.source)) ||
         (typeof ruleData.destination === 'string' && this.validate('destination', ruleData.destination))) {
        return;
      }

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
          this.setState({error: {
            ...this.state.error,
            background: {message: data.message}
          }})
          return;
        }
        (this.props as any).navigate('/')
      });
    }

    render() {
      return <Component onChange={this.onChange} onSave={this.onSave} error={this.state.error} mode={this.state.mode} id={this.state.id} />
    }
  }
}

export default FormHOC;