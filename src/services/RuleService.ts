import { FormField, FormType, FormTypeMap } from "../models/formField";
import Rule = chrome.declarativeNetRequest.Rule;
import UpdateRuleOptions = chrome.declarativeNetRequest.UpdateRuleOptions;
import RequestMethod = chrome.declarativeNetRequest.RequestMethod
import RuleCondition = chrome.declarativeNetRequest.RuleCondition
import RuleActionType = chrome.declarativeNetRequest.RuleActionType


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

    generateAction(formField: any) {
        return {
            type: FormTypeMap[formField.type],
            redirect : {
                ...(formField.redirectTo && {url: formField.redirectTo}),
                ...(formField.extensionPath && {extensionPath: formField.extensionPath}),
                ...(formField.regexSubstitution && {regexSubstitution: formField.regexSubstitution}),
                // "transform" property is not implemented
            }
        }
    }

    generateCondition(formField: any) {
        return {
            ...(formField.urlFilter && {urlFilter: formField.urlFilter}),
            ...(formField.regexFilter && {regexFilter: formField.regexFilter}),
            resourceTypes: ["main_frame", "sub_frame"]
            // some properties are not implemented
            // see docs
        }
    }

    generateRule(formField: any): Rule {
        const rule: Rule = {
            id: 1,
            priority: 1, 
            action: this.generateAction(formField),
            condition: this.generateCondition(formField),
        }
        console.log('rule', rule);
        return rule;
    }
}

export default new RuleService();