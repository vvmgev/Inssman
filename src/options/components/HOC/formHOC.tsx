import React from 'react';
import { FormMode, IForm, MatchType, MatchTypeMap } from 'src/models/formFieldModel';
import { PostMessageAction } from 'src/models/postMessageActionModel';
import { makeExactMatch, replaceAsterisk } from 'src/options/utils';
import ResourceType = chrome.declarativeNetRequest.ResourceType;

type State = {
  error: null | string,
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

    onSave = (form: IForm) => {
      const { id } = this.state;
      const { data: { ruleData }} = form;
      form.action = this.state.mode === FormMode.CREATE ? PostMessageAction.AddRule : PostMessageAction.UpdateRule;
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
          this.setState({error: data.message})
          return;
        }
        (this.props as any).navigate('/')
      });
    }

    render() {
      return <div>
        <Component onSave={this.onSave} error={this.state.error} mode={this.state.mode} id={this.state.id} />
      </div>
    }
  }
}

export default FormHOC;