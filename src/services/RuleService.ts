import { FormField } from "../models/formField";
import Rule = chrome.declarativeNetRequest.Rule;
import UpdateRuleOptions = chrome.declarativeNetRequest.UpdateRuleOptions;
import RequestMethod = chrome.declarativeNetRequest.RequestMethod
import RuleCondition = chrome.declarativeNetRequest.RuleCondition


class RuleService {
    add(rules: Rule[]): Promise<void> {
        const qq : number[] = rules.map(as => as.id)
        return this.updateDynamicRules({addRules: rules, removeRuleIds: qq})
    }

    remove(rules: Rule[]): Promise<void> {
        const removeRuleIds: number[] = rules.map(rule => rule.id);
        return this.updateDynamicRules({removeRuleIds})
    }

    async getRuleById(id: number): Promise<Rule | undefined> {
        const rules: Rule[] = await this.getRules();
        return rules.find(rule => rule.id === id);
    }

    updateDynamicRules(updateRuleOptions: UpdateRuleOptions): Promise<void> {
        return chrome.declarativeNetRequest.updateDynamicRules(updateRuleOptions);
    }

    getRules(): Promise<Rule[]> {
        return chrome.declarativeNetRequest.getDynamicRules();
    }

    generateRule(formField: any): Rule {
        const condition: RuleCondition = {
            urlFilter: formField.condition.urlFilter,
            regexFilter: formField.condition.regexFilter,
            ...(formField.condition?.resourceTypes?.length && {resourceTypes: formField.resourceTypes}),
            ...(formField.condition?.requestMethods?.length && {requestMethods: formField.requestMethods})
        }
        // const rule: Rule = {
        //     id: 1,
        //     priority: 1,
        //     action: {
        //         ...formField.action
        //     },
        //     condition,
        // };

        
        // const rule: any =  {
        //     "id": 7,
        //     "priority": 1,
        //     "action": {
        //       "type": "redirect",
        //       "redirect": {
        //         "regexSubstitution": "https://\\1.baaa.com"
        //       }
        //     },
        //     "condition": {
        //       "regexFilter": "^http[s]?://(abc|def).xyz.com",
        //       "resourceTypes": [
        //         "main_frame"
        //       ]
        //     }
        //   };

        // exact match
        // /^a$/;

        const rule: any =  {
          "id": 4,
          "priority": 1,
          "action": { "type": "redirect", "redirect": { "url": "https://example.com" } },
          "condition": { "urlFilter": " /^search$/", "resourceTypes": ["main_frame"] }
        };

        console.log('rule', rule);
        return rule;
    }
}

export default new RuleService();